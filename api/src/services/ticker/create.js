"use strict";

const { BigNumber } = require("@src/lib");
const { Ticker } = require("@src/models");
const moment = require("moment");

// ------------------------- Service -------------------------

/**
 *
 * @param {{
 *   pair_symbol: string,
 *   from: string,
 *   to: string,
 *   time: Date=,
 * }} input
 * @param {import("@src/utils/DBTransaction").DBTransaction=} DBT
 * @return {Promise<import("mongoose").Schema>}
 */
async function createTicker(input, DBT) {
  const { pair_symbol, from, to, high, low, time } = input;

  // const high = BigNumber.max(from, to).toFixed();
  // const low = BigNumber.min(from, to).toFixed();

  const [ticker] = await Ticker.create(
    [{
      pair_symbol,
      time,
      from,
      to,
      high,
      low,
    }],
    DBT.mongoose(),
  );

  return ticker;
}

// ------------------------- Exports -------------------------

module.exports = createTicker;
