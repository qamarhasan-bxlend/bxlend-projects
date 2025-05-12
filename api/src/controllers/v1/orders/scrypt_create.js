"use strict";

const { OrderBook } = require("@src/events");
const { Order, Currency } = require("@src/models");
const { Joi, BigNumber } = require("@src/lib");
const {
  ORDER_DIRECTION,
  OWNER,
  ORDER_KIND,
  CURRENCY_NETWORK_TO_MAIN_CURRENCY_CODE, SETTING, ERROR,
} = require("@src/constants");
const { auth, validate } = require("@src/middlewares");
const { trade } = require("@src/queue");
const Sentry = require("@sentry/node");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { showWalletService, showOrCreateWalletService, getSetting } = require("@src/services");
const { PaymentRequiredError } = require("@src/errors");
const { DBTransaction } = require("@src/utils");
const {create} = require("@src/lib/Scrypt/helpers/index")
// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
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
        quantity: Joi.string().required(),
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
      body: { direction, quantity, type, limit_price, stop_price, currency },
      query: { select },
    } = req;
    // TODO: update available_balance in case the new order is created.

    const toExcludeAfter = ["id", "kind"];
    let originWallet, destinationWallet;

    if (direction === ORDER_DIRECTION.BUY) {

      originWallet = await showWalletService({
        user,
        currency_code: currency_pair.currency_codes[1],
      });
      if (!originWallet) throw new PaymentRequiredError(ERROR.INSUFFICIENT_FUNDS);

      const { networks } = await Currency.findOne({ code: currency_pair.currency_codes[0] });
      const defaultMainCurrencyCode = CURRENCY_NETWORK_TO_MAIN_CURRENCY_CODE[networks[0]];
      if (!defaultMainCurrencyCode) throw new Error("Unsupported Coin Network");

      destinationWallet = await showOrCreateWalletService({
        user,
        currency_code: defaultMainCurrencyCode,
      });

    } else {

      originWallet = await showWalletService({
        user,
        currency_code: currency_pair.currency_codes[0],
      });
      if (!originWallet) throw new PaymentRequiredError(ERROR.INSUFFICIENT_FUNDS);

      const { networks } = await Currency.findOne({ code: currency_pair.currency_codes[1] });
      // TODO: handle network[0] === undefined
      const defaultMainCurrencyCode = CURRENCY_NETWORK_TO_MAIN_CURRENCY_CODE[networks[0]];
      if (!defaultMainCurrencyCode) throw new Error("Unsupported Coin Network");

      destinationWallet = await showOrCreateWalletService({
        user,
        currency_code: defaultMainCurrencyCode,
      });

    }

    // TODO: stop-limit is maker or taker?
    const feePercentage = getSetting(type === ORDER_KIND.MARKET ? SETTING.TAKER_FEE : SETTING.MAKER_FEE, 0);
    const feeAmount = new BigNumber(quantity).times(feePercentage);

    const fee = {
      percentage: feePercentage,
      amount: feeAmount.toFixed(),
    };

    const balanceDiff = new BigNumber(quantity).plus(feeAmount);
   
    if (balanceDiff.isGreaterThan(new BigNumber(originWallet.available_balance))) {
      throw new PaymentRequiredError(ERROR.INSUFFICIENT_FUNDS);
    }

    if (type === ORDER_KIND.LIMIT) fee.remainder = fee.amount;

    const DBT = await DBTransaction.init();

    let order;
    try {
      //TODO: handle for owner_type == MODEL.CLIENT
      const result = await Order.create(
        [{
          owner_type: OWNER.USER,
          owner: user._id,
          kind: ORDER_KIND[type],
          pair_symbol: currency_pair.symbol,
          wallets: [
            originWallet._id,
            destinationWallet._id,
          ],
          quantity,
          fee,
          direction: ORDER_DIRECTION[direction],
          remainder: type === ORDER_KIND.LIMIT || type === ORDER_KIND.STOP_LIMIT ? quantity : undefined,
          limit_price: type === ORDER_KIND.LIMIT || type === ORDER_KIND.STOP_LIMIT ? limit_price : undefined,
          stop_price: type === ORDER_KIND.STOP_LIMIT ? stop_price : undefined,
        }],
        DBT.mongoose(),
      );

      order = result[0];

      // TODO: minus the price after transaction is done on scrypt // Or maybe not in case of market
      originWallet.available_balance = new BigNumber(originWallet.available_balance).minus(balanceDiff).toFixed();

      await originWallet.save(DBT.mongoose());

      await DBT.commit();
      
      // TODO: create scrypt order
      create({
        "Side": order.direction,
        "OrderQty": order.quantity,
        "OrdType": order.kind,
        "ClOrdID": order.id,
        "currency_codes": currency_pair.currency_codes,
        "Currency": currency
      });

    } catch (error) {
      await DBT.abort();

      throw error;
    }

    if (ORDER_KIND.MARKET === ORDER_KIND[type]) trade[order.pair_symbol].add({ order: order._id }).catch((error) => Sentry.captureException(error));

    order = omit(order.toJSON(), difference(toExcludeAfter, select));

    res.json({ order });

    OrderBook.emit(currency_pair.symbol);
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/orders/{currency_pair}:
 *   post:
 *     tags:
 *       - Order
 *     description: Create a User's Order
 *     parameters:
 *       - $ref: "#/parameters/currency_pair_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Order Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OK"
 *       401:
 *         $ref: "#/responses/401"
 *       403:
 *         $ref: "#/responses/403"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */
