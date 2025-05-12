"use strict";

const { REDIS_URI } = require("@src/config");
const { OrderBook } = require("@src/events");
const { CurrencyPair, Order } = require("@src/models");
const { executeOrder } = require("@src/services");
const { trade } = require("@src/queue");
const Bull = require("bull");
const faker = require("faker");

/**
 * Create a new currency pair for unit tests.
 *
 * @param {import("mongoose").Document[]} currencies
 * @param {Object=} pair
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function currencyPairFactory(currencies = [], pair = {}) {
  let currency_codes = currencies.map(currency => currency.code);

  if (currency_codes.length === 0) currency_codes = [faker.finance.currencyCode(), faker.finance.currencyCode()];

  pair = await CurrencyPair.create({
    ...pair,
    currency_codes,
  });

  // ------------------------- Queue -------------------------

  trade[pair.symbol] = new Bull(`trade:${ pair.symbol }`, REDIS_URI);

  // ------------------------- Consumer -------------------------

  trade[pair.symbol]
    .process(1, async function tradeQueue(job) {
      const { order: orderId } = job.data;

      const marketOrder = await Order.findById(orderId)
        .populate("wallets")
        .populate({
          path: "pair",
          select: {
            currency_codes: true,
            price: true,
          },
        });

      return await executeOrder(marketOrder);

      // TODO: Send Notifications.
    })
    .catch(() => {
    });

  // ------------------------- Events -------------------------

  trade[pair.symbol].on(
    "completed",
    async () => OrderBook.emit(pair.symbol),
  );

  return pair;
};
