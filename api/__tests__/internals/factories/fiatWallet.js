"use strict";

const { MODEL, WALLET_OWNER } = require("@src/constants");
const { FiatWallet } = require("@src/models");
const faker = require("faker");

/**
 * Create a new fiat wallet for unit tests.
 *
 * @param {Object} owner
 * @param {Object} currency
 * @param {Object=} wallet
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function fiatWalletFactory(owner, currency, wallet = {}) {
  const owner_model = owner.constructor.modelName;

  const owner_type = owner_model === MODEL.USER ? WALLET_OWNER.USER : WALLET_OWNER.CLIENT;

  const balance = wallet.balance ?? faker.finance.amount();

  return FiatWallet.create({
    ...wallet,
    balance,
    available_balance: wallet.available_balance ?? balance,
    owner_type,
    owner: owner._id,
    currency_code: currency.code,
  });
};
