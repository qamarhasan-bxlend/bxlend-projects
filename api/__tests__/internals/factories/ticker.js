"use strict";

const { Ticker } = require("@src/models");
const faker = require("faker");
const moment = require("moment");

/**
 * Create a new ticker for unit tests.
 *
 * @param {Object=} ticker
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function tickerFactory(ticker = {}) {
  const from = ticker.from ?? faker.finance.amount();
  const to = ticker.to ?? faker.finance.amount();

  return Ticker.create({
    pair_symbol: `${ faker.finance.currencyCode() }${ faker.finance.currencyCode() }`,
    time: moment().utc().milliseconds(0).toDate(),
    high: `${Math.max(+from, +to)}`,
    low: `${Math.min(+from, +to)}`,
    ...ticker,
    from,
    to,
  });
};
