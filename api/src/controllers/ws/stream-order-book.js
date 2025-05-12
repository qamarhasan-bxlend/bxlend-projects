"use strict";

const { OrderBook } = require("@src/events");
const { orderBook } = require("@src/services");
const { wrapAsyncFn } = require("@src/utils");

module.exports = async function streamOrderBookWSController(req, res) {
  const { symbol, precision, limit } = req.query;

  const listener = wrapAsyncFn(async (data) => {
    // const book = await orderBook({
    //   pair_symbol: symbol,
    //   precision,
    //   limit,
    // });

    // //TODO: Not always sell is on 0 position of the aggregated array
    // res.send([
    //   new Date(),
    //   book[0].orders.map(order => [order.price, order.quantity]), // sells
    //   book[1].orders.map(order => [order.price, order.quantity]), // buys
    // ]);
    res.send(data)

  });

  OrderBook.on(symbol, listener);

  req.once("closed", () => OrderBook.off(symbol, listener));
};
