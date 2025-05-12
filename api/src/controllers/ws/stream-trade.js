"use strict";

const { trade } = require("@src/queue");
const { wrapAsyncFn } = require("@src/utils");

module.exports = async function streamTradeWSController(req, res) {
  const { symbol } = req.query;

  const listener = wrapAsyncFn(async (job, result) => {
    const { order } = result;

    res.send([
      order.updated_at,
      order.price,
      order.quantity,
      order.direction,
    ]);
  });

  trade[symbol].on("completed", listener);

  req.once("closed", () => trade[symbol].off("completed", listener));
};
