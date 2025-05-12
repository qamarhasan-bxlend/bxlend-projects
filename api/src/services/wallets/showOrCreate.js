"use strict";

const { CURRENCY_KIND } = require("@src/constants");
const Cryptoapis = require("@src/lib/Cryptoapis");
const { WalletCurrencyUnsupported } = require("@src/errors");
const showWalletService = require("./show");
const createCryptoWalletService = require("./createCrypto");
const createFiatWalletService = require("./createFiat");

// ------------------------- Service -------------------------

/**
 *
 * @param {{
 *   user: Object,
 *   network: String,
 * }} input
 * @param {import("@src/utils/DBTransaction").DBTransaction=} DBT
 * @returns {Promise<Object>}
 */

async function showOrCreateWalletService(input, DBT) {
  const { user, currency_code, currency_kind, crypto_type } = input;
  try {
    let wallet = await showWalletService({ user, currency_code, currency_kind }, DBT);

    if (!wallet) {
      if (currency_kind == CURRENCY_KIND.FIAT) {
        // Create FIAT wallet
        wallet = await createFiatWalletService({ user, currency_code }, DBT);
      } else {
        // Create CRYPTO Wallet
        wallet = await createCryptoWalletService({ user, currency_code, crypto_type }, DBT);
      }
    }
    return wallet;

  }
  catch (error) {
    // console.log(error)
    throw new Error(error.message)

  }


}

// ------------------------- Exports -------------------------

module.exports = showOrCreateWalletService;
