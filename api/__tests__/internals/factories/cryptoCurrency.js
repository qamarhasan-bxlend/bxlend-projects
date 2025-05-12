"use strict";

const { S3_ACL, CURRENCY_NETWORK } = require("@src/constants");
const { CryptoCurrency } = require("@src/models");
const { S3 } = require("@src/lib");
const faker = require("faker");

/**
 * Create a new crypto currency for unit tests.
 *
 * @param {Object=} currency
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function cryptoCurrencyFactory(currency = {}) {
  return CryptoCurrency.create({
    code: faker.finance.currencyCode(),
    name: faker.finance.currencyName(),
    display_decimals: 18,
    decimals: 18,
    icon: await S3.upload("icons", "svg", "some-svg", S3_ACL.PUBLIC),
    website: faker.internet.url(),
    networks: [CURRENCY_NETWORK.ERC20],
    ...currency,
  });
};
