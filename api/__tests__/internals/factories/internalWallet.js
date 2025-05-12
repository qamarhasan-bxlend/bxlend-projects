"use strict";

const { InternalWallet } = require("@src/models");
const faker = require("faker");
const { CRYPTO_WALLET_PLATFORM } = require("@src/constants");

/**
 * Create a new internal wallet for unit tests.
 *
 * @param {Object} currency
 * @param {Object=} wallet
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function internalWalletFactory(currency, wallet = {}) {
  return InternalWallet.create({
    address: faker.datatype.uuid(),
    platform_id: faker.datatype.uuid(),
    platform_options: {
      currency_code: `t${ currency.code.toLowerCase() }`,
    },
    balance: "0",
    ...wallet,
    currency_code: currency.code,
    platform: CRYPTO_WALLET_PLATFORM.BITGO,
  });
};
