"use strict";

const { CryptoWallet, InternalWallet } = require("@src/models");
const { WALLET_OWNER, CRYPTO_WALLET_PLATFORM } = require("@src/constants");
const Cryptoapis = require("@src/lib/Cryptoapis"); // TODO: export it how other libs are getting exported
const Vaultody = require("@src/lib/Vaultody");
const { WalletCurrencyUnsupported, WalletError } = require("@src/errors");

// ------------------------- Service -------------------------

/**
 * This service is responsible for creating a crypto wallet in the system without generating a deposit address.
 *
 * @param {{
*   user: Object,
*   currency_code: String,
* }} input
* @param {import("@src/utils/DBTransaction").DBTransaction=} DBT
* @returns {Promise<Object>}
*/

async function createCryptoWalletService(input, DBT) {
 const { user, currency_code } = input;

 // Creating the wallet in the database without an address (to be generated on deposit request)
 try {
   const newWallet = await CryptoWallet.create({
     owner_type: WALLET_OWNER.USER,
     owner: user._id,
     currency_code,
   });

   return newWallet;
 } catch (err) {
   console.log(err);
   throw new WalletError(
     "An error occurred while creating the wallet. Please contact customer support."
   );
 }
}


// ------------------------- Exports -------------------------

module.exports = createCryptoWalletService;
