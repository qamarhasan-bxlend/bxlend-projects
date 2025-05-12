"use strict";

const { FiatWallet, InternalWallet } = require("@src/models");
const { WALLET_OWNER, CURRENCY_KIND } = require("@src/constants");
const { WalletCurrencyUnsupported } = require("@src/errors");

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

async function createFiatWalletService(input, DBT) {

  const { user, currency_code } = input;
  
  // Creating wallet in internal db
  return await FiatWallet.create({
    owner_type: WALLET_OWNER.USER,
    owner: user._id,
    currency_code,
  });
}

// ------------------------- Exports -------------------------

module.exports = createFiatWalletService;
