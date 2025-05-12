"use strict";

const { Order } = require("@src/models");
const { ORDER_KIND, ORDER_DIRECTION } = require("@src/constants");

// ------------------------- Service -------------------------

/**
 *
 * @param {{
 *   pair_symbol: string,
 *   precision: string,
 *   limit: number=,
 * }} input
 * @param {import("@src/utils/DBTransaction").DBTransaction=} DBT
 * @returns {Promise<Object[][]>}
 */
async function orderBook(input, DBT) {
  const { pair_symbol, precision } = input;

  // TODO: handle "limit", max number of items in buy/sell list.
  let book = await Order
    .aggregate([
      {
        $match: {
          kind: {
            $ne: ORDER_KIND.MARKET,
          },
          pair_symbol,
        },
      },
      {
        $project: {
          direction: "$direction",
          quantity: 1,
          buy_quantity: { $cond: [{ $strcasecmp: ["$direction", ORDER_DIRECTION.SELL] }, "$quantity", 0.0] },
          sell_quantity: { $cond: [{ $strcasecmp: ["$direction", ORDER_DIRECTION.BUY] }, "$quantity", 0.0] },
          modularPrice: {
            $let: {
              vars: {
                precision: { $toDecimal: precision },
                price: "$limit_price",
              },
              in: {
                $subtract: [
                  "$$price",
                  {
                    $mod: [
                      "$$price",
                      "$$precision",
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$modularPrice",
          buy: { $sum: "$buy_quantity" },
          sell: { $sum: "$sell_quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          modularPrice: "$_id",
          orders: [
            {
              direction: ORDER_DIRECTION.BUY,
              aggregatedQuantity: "$buy",
            },
            {
              direction: ORDER_DIRECTION.SELL,
              aggregatedQuantity: "$sell",
            },
          ],
        },
      },
      { $unwind: "$orders" },
      {
        $group: {
          _id: "$orders.direction",
          orders_unprocessed: {
            $push: {
              price: { $toString: "$modularPrice" },
              quantity: { $toString: "$orders.aggregatedQuantity" },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          orders: {
            $filter: {
              input: "$orders_unprocessed",
              as: "order",
              cond: { $gt: ["$$order.quantity", "0"] },
            },
          },
        },
      },
    ])
    .session(DBT?.session);

  if( !book.length ){
    book = [
      {
        type:ORDER_DIRECTION.BUY,
        orders: [],
      },
      {
        type:ORDER_DIRECTION.SELL,
        orders: [],
      },
    ];
  }

  return book;
}

// ------------------------- Exports -------------------------

module.exports = orderBook;
