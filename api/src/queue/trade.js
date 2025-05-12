"use strict";

const { REDIS_URI } = require("@src/config");
const { OrderBook } = require("@src/events");
const { Order, CurrencyPair } = require("@src/models");
const { executeOrder } = require("@src/services");
const Sentry = require("@sentry/node");
const Bull = require("bull");
const { loopWhile } = require("deasync");

// ------------------------- Queue -------------------------

const QUEUE = {};

let loaded = false;

CurrencyPair
  .find({ deleted_at: { $exists: false } })
  .then((pairs) => {
    pairs.forEach((pair) => QUEUE[pair.symbol] = new Bull(`trade:${ pair.symbol }`, REDIS_URI));

    loaded = true;
  })
  .catch((error) => {
    console.error(error);

    process.exit(1);
  });

loopWhile(() => !loaded);

// ------------------------- Consumers -------------------------

Object
  .keys(QUEUE)
  .forEach((symbol) => {
    const Queue = QUEUE[symbol];

    // ------------------------- Consumer -------------------------

    Queue
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
      .catch((error) => {
        Sentry.captureException(error);
      });

    // ------------------------- Events -------------------------

    Queue.on(
      "completed",
      async () => OrderBook.emit(symbol),
    );
  });

// ------------------------- Exports -------------------------

module.exports = QUEUE;
