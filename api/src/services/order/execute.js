"use strict";

const {
  ORDER_DIRECTION,
  ORDER_KIND,
  ORDER_STATUS,
  COLLECTION,
  DISCRIMINATOR,
  ORDER_REASON,
} = require("@src/constants");
const { BigNumber } = require("@src/lib");
const { Order, Transaction, Wallet, CurrencyPair, InternalWallet } = require("@src/models");
const updateOrCreateTicker = require("@src/services/ticker/update-or-create");
const { DBTransaction } = require("@src/utils");
const { Types: { Decimal128 } } = require("mongoose");
const createTransactions = require("./create-transactions");

// ------------------------- Service -------------------------

/**
 *
 * @param {import("mongoose").Document} marketOrder
 * @return {Promise<Object>}
 */
async function executeOrder(marketOrder) {
  if (!marketOrder.populated("wallets")) marketOrder.populate("wallets");

  if (!marketOrder.populated("pair")) marketOrder.populate("pair");

  await marketOrder.execPopulate();

  const pair_symbol = marketOrder.pair_symbol;
  const direction = marketOrder.direction;
  const startingPrice = marketOrder.pair.price;
  const startingQuantity = new BigNumber(marketOrder.quantity);
  const currencyCodes = marketOrder.pair.currency_codes;

  // TODO: cache internal wallets in memory?
  const internalWallets = await InternalWallet.find({
    currency_code: { $in: currencyCodes },
  });

  let sourceCurrencyCode;
  let targetCurrencyCode;

  const pipeline = [];

  switch (direction) {
    case ORDER_DIRECTION.BUY:
      pipeline.push(
        {
          $match: {
            $and: [
              {
                [DISCRIMINATOR]: ORDER_KIND.LIMIT,
                pair_symbol,
                direction: ORDER_DIRECTION.SELL,
                status: ORDER_STATUS.ACTIVE,
                wallets: { $nin: marketOrder.wallets.map(wallet => wallet._id) },
                limit_price: { $gte: Decimal128.fromString(startingPrice) },
              },
              // {
              //   $or: [
              //     {
              //       [DISCRIMINATOR]: ORDER_KIND.LIMIT,
              //     },
              //     {
              //       [DISCRIMINATOR]: ORDER_KIND.STOP_LIMIT,
              //       stop_price: { $gte: startingPrice }, // TODO: Fix stop-limit
              //     },
              //   ],
              // },
            ],
          },
        },
        {
          $sort: {
            limit_price: -1,
            created_at: 1,
          },
        },
      );

      sourceCurrencyCode = currencyCodes[0];
      targetCurrencyCode = currencyCodes[1];

      break;
    case ORDER_DIRECTION.SELL:
      pipeline.push(
        {
          $match: {
            $and: [
              {
                [DISCRIMINATOR]: ORDER_KIND.LIMIT,
                pair_symbol,
                direction: ORDER_DIRECTION.BUY,
                status: ORDER_STATUS.ACTIVE,
                wallets: { $nin: marketOrder.wallets.map(wallet => wallet._id) },
                limit_price: { $lte: Decimal128.fromString(startingPrice) },
              },
              // {
              //   $or: [
              //     {
              //       [DISCRIMINATOR]: ORDER_KIND.LIMIT,
              //     },
              //     {
              //       [DISCRIMINATOR]: ORDER_KIND.STOP_LIMIT,
              //       stop_price: { $lte: startingPrice }, // TODO: Fix stop-limit
              //     },
              //   ],
              // },
            ],
          },
        },
        {
          $sort: {
            limit_price: 1,
            created_at: 1,
          },
        },
      );

      sourceCurrencyCode = currencyCodes[1];
      targetCurrencyCode = currencyCodes[0];

      break;
  }

  const marketOrderSourceWallet = marketOrder.wallets.find(wallet => wallet.currency_code === sourceCurrencyCode);
  const marketOrderTargetWallet = marketOrder.wallets.find(wallet => wallet.currency_code === targetCurrencyCode);

  const sourceInternalWallet = internalWallets.find(wallet => wallet.currency_code === sourceCurrencyCode);
  const targetInternalWallet = internalWallets.find(wallet => wallet.currency_code === targetCurrencyCode);

  pipeline.push({
    $lookup: {
      from: COLLECTION.WALLET,
      localField: "wallets",
      foreignField: "_id",
      as: "wallets",
    },
  });

  const orderBook = Order.aggregate(pipeline);

  const orderBulkWrites = [];
  const transactions = [];
  const walletBulkWrites = [];

  let price = new BigNumber(startingPrice);
  let sourceQuantity = new BigNumber(startingQuantity);
  let targetQuantity = new BigNumber(0);
  let limitOrderFee = new BigNumber(0);

  const updated_at = new Date();

  tradeLoop: for await (const order of orderBook) {
    price = new BigNumber(order.limit_price);
    const orderQuantity = new BigNumber(order.remainder);

    const quantity = direction === ORDER_DIRECTION.BUY ? sourceQuantity.times(price) : sourceQuantity.div(price);

    const orderSourceWallet = order.wallets.find(wallet => wallet.currency_code === targetCurrencyCode);
    const orderTargetWallet = order.wallets.find(wallet => wallet.currency_code === sourceCurrencyCode);

    const orderFeeRemainder = order.fee.remainder;

    switch (orderQuantity.comparedTo(quantity)) {
      case 0:
        orderBulkWrites.push(
          {
            updateOne: {
              filter: {
                [DISCRIMINATOR]: order[DISCRIMINATOR],
                _id: order._id,
              },
              update: {
                remainder: "0",
                "fee.remainder": Decimal128.fromString("0"),
                executed_price: price.toFixed(),
                status: ORDER_STATUS.FULFILLED,
                updated_at,
              },
            },
          },
        );

        createTransactions({
          transactions,
          marketOrder,
          order,
          sourceCurrencyCode,
          targetCurrencyCode,
          sourceQuantity,
          quantity,
          price,
        });

        walletBulkWrites.push(
          {
            updateOne: {
              filter: {
                _id: orderSourceWallet._id,
              },
              update: {
                $inc: {
                  balance: quantity.plus(orderFeeRemainder).negated().toFixed(),
                },
              },
            },
          },
          {
            updateOne: {
              filter: {
                _id: orderTargetWallet._id,
              },
              update: {
                $inc: {
                  balance: sourceQuantity.toFixed(),
                },
              },
            },
          },
        );

        // collect fee
        limitOrderFee = limitOrderFee.plus(orderFeeRemainder);

        sourceQuantity = new BigNumber("0");
        targetQuantity = targetQuantity.plus(quantity);

        break tradeLoop;
      case 1: {
        const feeToCollect = new BigNumber(orderFeeRemainder).times(quantity.div(orderQuantity));

        orderBulkWrites.push(
          {
            updateOne: {
              filter: {
                [DISCRIMINATOR]: order[DISCRIMINATOR],
                _id: order._id,
              },
              update: {
                $inc: {
                  remainder: quantity.negated().toFixed(),
                  "fee.remainder": Decimal128.fromString(feeToCollect.negated().toFixed()),
                },
                $set: {
                  executed_price: price.toFixed(),
                  updated_at,
                },
              },
            },
          },
        );

        createTransactions({
          transactions,
          marketOrder,
          order,
          sourceCurrencyCode,
          targetCurrencyCode,
          sourceQuantity,
          quantity,
          price,
        });

        walletBulkWrites.push(
          {
            updateOne: {
              filter: {
                _id: orderSourceWallet._id,
              },
              update: {
                $inc: {
                  balance: quantity.plus(feeToCollect).negated().toFixed(),
                },
              },
            },
          },
          {
            updateOne: {
              filter: {
                _id: orderTargetWallet._id,
              },
              update: {
                $inc: {
                  balance: sourceQuantity.toFixed(),
                },
              },
            },
          },
        );

        // collect fee
        limitOrderFee = limitOrderFee.plus(feeToCollect);

        sourceQuantity = new BigNumber("0");
        targetQuantity = targetQuantity.plus(quantity);

        break tradeLoop;
      }
      case -1: {
        const currentTargetQuantity = orderQuantity;
        const currentSourceQuantity = currentTargetQuantity.div(price);

        orderBulkWrites.push(
          {
            updateOne: {
              filter: {
                [DISCRIMINATOR]: order[DISCRIMINATOR],
                _id: order._id,
              },
              update: {
                remainder: "0",
                "fee.remainder": Decimal128.fromString("0"),
                executed_price: price.toFixed(),
                status: ORDER_STATUS.FULFILLED,
                updated_at,
              },
            },
          },
        );

        createTransactions({
          transactions,
          marketOrder,
          order,
          sourceCurrencyCode,
          targetCurrencyCode,
          sourceQuantity: currentSourceQuantity,
          quantity: currentTargetQuantity,
          price,
        });

        walletBulkWrites.push(
          {
            updateOne: {
              filter: {
                _id: orderSourceWallet._id,
              },
              update: {
                $inc: {
                  balance: currentTargetQuantity.plus(orderFeeRemainder).negated().toFixed(),
                },
              },
            },
          },
          {
            updateOne: {
              filter: {
                _id: orderTargetWallet._id,
              },
              update: {
                $inc: {
                  balance: currentSourceQuantity.toFixed(),
                },
              },
            },
          },
        );

        // collect fee
        limitOrderFee = limitOrderFee.plus(orderFeeRemainder);

        sourceQuantity = sourceQuantity.minus(currentSourceQuantity);
        targetQuantity = targetQuantity.plus(currentTargetQuantity);

        break;
      }
      case null:
      default: {
        const error = new Error("Unexpected quantity value");

        error.marketOrderId = marketOrder._id.toString();
        error.limitOrderId = order._id.toString();

        throw error;
      }
    }
  }

  const marketOrderFee = marketOrder.fee.amount.toString();

  if (sourceQuantity.isGreaterThan(0)) {
    const DBT = await DBTransaction.init();

    try {
      marketOrder.status = ORDER_STATUS.FAILED;
      marketOrder.reason = ORDER_REASON.INSUFFICIENT_MAKER_LIQUIDITY;

      await marketOrder.save(DBT.mongoose());

      await Wallet.updateOne(
        { _id: marketOrderSourceWallet._id },
        {
          $inc: {
            available_balance: startingQuantity.plus(marketOrderFee).toFixed(),
          },
        },
        DBT.mongoose(),
      );

      await DBT.commit();
    } catch (error) {
      await DBT.abort();

      throw error;
    }

    return;
  }

  const marketOrderExecutedPrice = targetQuantity.div(startingQuantity).toFixed();

  orderBulkWrites.push(
    {
      updateOne: {
        filter: {
          [DISCRIMINATOR]: marketOrder[DISCRIMINATOR],
          _id: marketOrder._id,
        },
        update: {
          executed_price: marketOrderExecutedPrice,
          status: ORDER_STATUS.FULFILLED,
          updated_at,
        },
      },
    },
  );

  walletBulkWrites.push(
    {
      updateOne: {
        filter: {
          _id: marketOrderSourceWallet._id,
        },
        update: {
          $inc: {
            balance: startingQuantity.plus(marketOrderFee).negated().toFixed(),
          },
        },
      },
    },
    {
      updateOne: {
        filter: {
          _id: marketOrderTargetWallet._id,
        },
        update: {
          $inc: {
            balance: targetQuantity.toFixed(),
          },
        },
      },
    },
    { // collect fee
      updateOne: {
        filter: {
          _id: sourceInternalWallet._id,
        },
        update: {
          $inc: {
            balance: marketOrderFee,
          },
        },
      },
    },
    { // collect fee
      updateOne: {
        filter: {
          _id: targetInternalWallet._id,
        },
        update: {
          $inc: {
            balance: limitOrderFee.toFixed(),
          },
        },
      },
    },
  );

  const DBT = await DBTransaction.init();

  try {
    await Order.bulkWrite(orderBulkWrites, DBT.mongoose());

    await Transaction.create(transactions, DBT.mongoose());

    await Wallet.bulkWrite(walletBulkWrites, DBT.mongoose());

    if (!price.isEqualTo(startingPrice)) {
      await CurrencyPair.updateOne(
        {
          symbol: pair_symbol,
        },
        {
          price: price.toFixed(),
        },
        DBT.mongoose(),
      );
    }

    const ticker = await updateOrCreateTicker({
      pair_symbol,
      initialPrice: startingPrice,
      finalPrice: price.toFixed(),
    }, DBT);

    await DBT.commit();

    return {
      ticker,
      order: {
        updated_at,
        price: marketOrderExecutedPrice,
        quantity: startingQuantity.toFixed(),
        direction,
      },
    };
  } catch (error) {
    await DBT.abort();

    throw error;
  }
}

// ------------------------- Exports -------------------------

module.exports = executeOrder;

