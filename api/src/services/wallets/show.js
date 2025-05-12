"use strict";

const { Wallet } = require("@src/models");

// ------------------------- Service -------------------------

/**
 *
 * @param {{
 *   user: Object,
 *   currency_code: String,
 * }} input
 * @param {import("@src/utils/DBTransaction").DBTransaction=} DBT
 * @returns {Promise<Object>}
 */
//TODO: What for FiatWallets?
async function showWalletService(input, DBT) {
  const { user, currency_code, currency_kind } = input;

  return await Wallet.findOne({
    currency_code,
    owner: user._id,
    // kind: currency_kind TODO: Pass kind in future incase of currency confilct between crypto and fiat
  }).session(DBT?.session);
}

// ------------------------- Exports -------------------------

module.exports = showWalletService;
