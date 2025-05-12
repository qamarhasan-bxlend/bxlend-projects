"use strict";

const { FiatCurrency } = require("@src/models");
const faker = require("faker");

/**
 * Create a new fiat currency for unit tests.
 *
 * @param {Object=} currency
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function fiatCurrencyFactory(currency = {}) {
  return FiatCurrency.create({
    code: faker.finance.currencyCode(),
    name: faker.finance.currencyName(),
    display_decimals: 18,
    symbol: faker.finance.currencySymbol(),
    country_code: faker.address.countryCode(),
    ...currency,
  });
};
