"use strict";

const { Ticker } = require("@src/models");

// ------------------------- Service -------------------------

/**
 *
 * @param {{
 *   pair_symbol: string,
 *   interval: number,
 *   sort: number=,
 *   skip: number=,
 *   limit: number=,
 * }} input
 * @param {import("@src/utils/DBTransaction").DBTransaction=} DBT
 * @return {Promise<import("mongoose").Schema[]>}
 */
async function listKLines(input, DBT) {
  const { pair_symbol, interval, sort = -1, skip = 0, limit = 0 } = input;

  const pipeline = [
    {
      $match: {
        pair_symbol,
      },
    },
    {
      $sort: {
        time: sort,
      },
    },
    {
      $project: {
        bracket: {
          $let: {
            vars: {
              timestamp: {
                $floor: {
                  $divide: [
                    { $toDecimal: "$time" },
                    1000,
                  ],
                },
              },
            },
            in: {
              $floor: {
                $divide: [
                  "$$timestamp",
                  interval,
                ],
              },
            },
          },
        },
        open: "$from",
        close: "$to",
        high: "$high",
        low: "$low",
      },
    },
    {
      $group: {
        _id: "$bracket",
        open: { $first: "$open" },
        close: { $last: "$close" },
        high: { $max: "$high" },
        low: { $min: "$low" },
      },
    },
  ];

  if (skip > 0) pipeline.push({ $skip: skip });

  if (limit > 0) pipeline.push({ $limit: limit });

  pipeline.push({
    $project: {
      _id: 0,
      timestamp: {
        $let: {
          vars: {
            timestamp: {
              $multiply: [
                "$_id",
                interval * 1000,
              ],
            },
          },
          in: { $toDate: "$$timestamp" },
        },
      },
      open: 1,
      close: 1,
      high: 1,
      low: 1,
    },
  });

  //TODO: Also do the intervals for 1M and 1Y and 1W

  return Ticker
    .aggregate(pipeline)
    .session(DBT?.session);
}

// ------------------------- Exports -------------------------

module.exports = listKLines;
