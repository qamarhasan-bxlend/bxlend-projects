"use strict";

const { BigNumber } = require("@src/lib");
const { Ticker } = require("@src/models");
const moment = require("moment");
const createTicker = require("./create");

// ------------------------- Service -------------------------

/**
 *
 * @param {{
 *   pair_symbol: string,
 *   initialPrice: string,
 *   finalPrice: string,
 *   time: Date=,
 * }} input
 * @param {import("@src/utils/DBTransaction").DBTransaction=} DBT
 * @return {Promise<import("mongoose").Schema>}
 */
async function updateOrCreateTicker(input, DBT) {
  const { pair_symbol, initialPrice, finalPrice, time = moment().utc().milliseconds(0).toDate() } = input;

  let ticker = await Ticker.findOne(
    {
      pair_symbol,
      time,
    },
    undefined,
    DBT?.mongoose(),
  );

  if (ticker == null) {
    return createTicker(
      {
        pair_symbol,
        time,
        from: initialPrice,
        to: finalPrice,
      },
      DBT,
    );
  }

  ticker.to = finalPrice;
  ticker.high = BigNumber.max(initialPrice, finalPrice, ticker.high).toFixed();
  ticker.low = BigNumber.min(initialPrice, finalPrice, ticker.low).toFixed();

  return ticker.save(DBT?.mongoose());
}

// ------------------------- Exports -------------------------

module.exports = updateOrCreateTicker;
