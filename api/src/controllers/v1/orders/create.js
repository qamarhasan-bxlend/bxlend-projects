"use strict";

const { OrderBook } = require("@src/events");
const { Order, Currency, Verification, Notification } = require("@src/models");
const { Joi, BigNumber, Bitstamp } = require("@src/lib");
const {
  ORDER_DIRECTION,
  OWNER,
  ORDER_KIND,
  SETTING,
  ERROR,
  ORDER_STATUS,
} = require("@src/constants");
const { auth, emailAuth, kycAuth, validate } = require("@src/middlewares");
const Sentry = require("@sentry/node");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const {
  showWalletService,
  showOrCreateWalletService,
  getSetting,
} = require("@src/services");
const { PaymentRequiredError } = require("@src/errors");
const { DBTransaction } = require("@src/utils");
const { Mailgun } = require('@src/lib');

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  emailAuth(),
  kycAuth(),
  bodyParser.json(),
  validate({
    body: Joi.object()
      .keys({
        direction: Joi.string()
          .valid(...Object.keys(ORDER_DIRECTION))
          .required(),
        type: Joi.string()
          .valid(ORDER_KIND.MARKET, ORDER_KIND.LIMIT)
          // .valid(...Object.keys(ORDER_KIND)) // TODO: add stop-limit order functionality
          .required(),
        amount: Joi.string().required(),
        limit_price: Joi.alternatives().conditional("type", {
          switch: [
            { is: ORDER_KIND.LIMIT, then: Joi.string().required() },
            { is: ORDER_KIND.STOP_LIMIT, then: Joi.string().required() },
          ],
          otherwise: Joi.string(),
        }),
        stop_price: Joi.alternatives().conditional("type", {
          is: ORDER_KIND.STOP_LIMIT,
          then: Joi.string().required(),
          otherwise: Joi.string(),
        }),
        currency: Joi.string().required(),
      })
      .required(),
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...Order.getSelectableFields()))
        .default([]),
    }),
  }),
  async function createOrderV1Controller(req, res) {
    const {
      user,
      params: { currency_pair },
      body: { direction, amount, type, limit_price, stop_price, currency },
      query: { select },
    } = req;
    const userInfo = await Verification.findOne({ user: user._id })

    const toExcludeAfter = ["id", "kind", "provider_info"];
    let transaction, originWallet, destinationWallet, currency_check;

    currency_check = await Currency.findOne({ code: currency })
    if (!currency_check) {
      throw new Error(ERROR.CURRENCY_NOT_FOUND)
    }

    if (direction === ORDER_DIRECTION.BUY) {
      originWallet = await showWalletService({
        user,
        currency_code: currency_pair.currency_codes[1],
      });

      if (!originWallet)
        throw new Error(ERROR.WALLET_NOT_FOUND);

      destinationWallet = await showOrCreateWalletService({
        user,
        currency_code: currency_pair.currency_codes[0],
        crypto_type: currency_check.crypto_type
      });

    } else {
      originWallet = await showWalletService({
        user,
        currency_code: currency_pair.currency_codes[0],
      });
      if (!originWallet)
        throw new Error(ERROR.WALLET_NOT_FOUND);

      destinationWallet = await showOrCreateWalletService({
        user,
        currency_code: currency_pair.currency_codes[1],
        crypto_type: currency_check.crypto_type
      });
    }
    // TODO: stop-limit is maker or taker?
    const feePercentage = getSetting(
      type === ORDER_KIND.MARKET ? SETTING.TAKER_FEE : SETTING.MAKER_FEE,
      0
    );
    const feeAmount = new BigNumber(amount).times(feePercentage);
    const fee = {
      percentage: feePercentage,
      amount: feeAmount.toFixed(),
    };

    const balanceDiff = new BigNumber(amount).plus(feeAmount);
    if (
      balanceDiff.isGreaterThan(new BigNumber(originWallet.available_balance))
    ) {
      throw new PaymentRequiredError(ERROR.INSUFFICIENT_FUNDS);
    }

    if (type === ORDER_KIND.LIMIT) fee.remainder = fee.amount;

    const DBT = await DBTransaction.init();

    let order, newOrder;
    try {
      //TODO: handle for owner_type == MODEL.CLIENT
      newOrder = await Order.create(
        [
          {
            owner_type: OWNER.USER,
            owner: user._id,
            kind: ORDER_KIND[type],
            pair_symbol: currency_pair.symbol,
            wallets: [originWallet._id, destinationWallet._id],
            amount: direction == "BUY" ? amount : 0,
            quantity: direction == "SELL" ? amount : 0,
            fee,
            status: ORDER_STATUS.PENDING,
            direction: ORDER_DIRECTION[direction],
            remainder:
              type === ORDER_KIND.LIMIT || type === ORDER_KIND.STOP_LIMIT
                ? amount
                : undefined,
            limit_price:
              type === ORDER_KIND.LIMIT || type === ORDER_KIND.STOP_LIMIT
                ? limit_price
                : undefined,
            stop_price: type === ORDER_KIND.STOP_LIMIT ? stop_price : undefined,
          },
        ],
        DBT.mongoose()
      );

      order = newOrder[0];
      originWallet.available_balance = new BigNumber(
        originWallet.available_balance
      )
        .minus(balanceDiff)
        .toFixed();

      await originWallet.save(DBT.mongoose());

      // const bitstampOrder = await Bitstamp.createInstantOrder({
      //   clOrdID: order.id,
      //   orderQty: direction == "BUY" ? order.amount : order.quantity,
      //   marketSymbol: currency_pair.symbol.toLowerCase(),
      //   orderKind: ORDER_DIRECTION[direction].toLowerCase(),
      // });
      //dummy data for deployment 
      const bitstampOrder = {
        price: '20',
        market: currency_pair.symbol.toLowerCase(),
        id: '123452345',
        type: 'SELL',
        amount: '20'
      }
      const provider_info = {
        id: '12345678',
        market: currency_pair.symbol.toLowerCase(),
        executed_price: '1.00',
        datetime: '1123',
        type: 'SELL',
        amount: '20'
      }
      //*dummy data ends



      const parsedDate = new Date(bitstampOrder.datetime);
      // const provider_info = {
      //   id: bitstampOrder.id,
      //   market: bitstampOrder.market,
      //   executed_price: bitstampOrder.price,
      //   datetime: parsedDate,
      //   type: bitstampOrder.type,
      //   amount: bitstampOrder.amount
      // }


      newOrder[0].status = ORDER_STATUS.FULFILLED;
      newOrder[0].provider_info = provider_info;

      // 5% increment on Executed price when direction is BUY & 5% decrement in Executed price when direction is SELL
      const spread = getSetting(SETTING.SPREAD, 0)
      newOrder[0].executed_price =
        newOrder[0].direction == 'BUY'
          ? (parseFloat(bitstampOrder.price) + parseFloat(bitstampOrder.price) * (spread / 100)).toFixed(6)
          : (parseFloat(bitstampOrder.price) - parseFloat(bitstampOrder.price) * (spread / 100)).toFixed(6);

      if (direction == "BUY") {
        newOrder[0].quantity = (newOrder[0].amount / newOrder[0].executed_price).toFixed(5);
      } else {
        newOrder[0].amount =
          (newOrder[0].executed_price * newOrder[0].quantity).toFixed(5);
      }
      newOrder[0].status = ORDER_STATUS.FULFILLED;
      newOrder[0].provider_info = provider_info;

      await newOrder[0].save(DBT.mongoose());

      transaction = {
        id: newOrder[0].id,
        quantity: direction == "BUY" ? newOrder[0].quantity : newOrder[0].amount,
        currency_code: `${destinationWallet.currency_code}`,
        created_at: `${newOrder[0].created_at}`,
        fee: newOrder[0].fee.amount,
        direction: newOrder[0].direction,
        status: newOrder[0].status
      }

      destinationWallet.available_balance = new BigNumber(
        destinationWallet.available_balance
      )
        .plus(direction == "BUY" ? newOrder[0].quantity : newOrder[0].amount)
        .toFixed();

      await destinationWallet.save(DBT.mongoose());
      await Notification.create(
        [{
          user: user._id,
          title: 'Order',
          message: 'Order has been successfully created.',

        }], DBT.mongoose())

      // uncomment below line after final deployment
      // await Mailgun.sendOrderCreationEmail(user, transaction) 
      await DBT.commit();
    } catch (error) {
      await DBT.abort();
      console.log(error)
      throw new Error(error.message);
    }
    // if (ORDER_KIND.MARKET === ORDER_KIND[type])
    //   trade[order.pair_symbol]
    //     .add({ order: order._id })
    //     .catch((error) => Sentry.captureException(error));

    order = omit(order.toJSON(), difference(toExcludeAfter, select));
    res.json({ order });

    OrderBook.emit(currency_pair.symbol);
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

