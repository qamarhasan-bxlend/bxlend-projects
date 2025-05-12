"use strict";

const { CryptoWallet, InternalWallet } = require("@src/models");
const { WALLET_OWNER, CRYPTO_WALLET_PLATFORM } = require("@src/constants");
const Cryptoapis = require("@src/lib/Cryptoapis"); // TODO: export it how other libs are getting exported
const Vaultody = require("@src/lib/Vaultody");
const { WalletCurrencyUnsupported, WalletError } = require("@src/errors");

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

async function generateDepositAddressService(input, DBT) {
  const { user, currency_code, crypto_type } = input;

  const internalWallet = await InternalWallet.findOne({
    currency_code,
  }).session(DBT?.session);
  if (!internalWallet)
    throw new WalletCurrencyUnsupported(
      "This Currency is Not supported by the Platform"
    );

  try {
    if (internalWallet.platform === CRYPTO_WALLET_PLATFORM.BXLEND) {
      // Creating wallet in internal db
      return await CryptoWallet.create({
        address: "unavailable",
        owner_type: WALLET_OWNER.USER,
        owner: user._id,
        currency_code,
      });
    } else if (internalWallet.platform === CRYPTO_WALLET_PLATFORM.VAULTODY) {
      // Creating wallet on Third party wallet provider's side
      console.log("Heyyyy")
      const newInternalWallet = await Vaultody.createWalletAddress(
        internalWallet.platform_options.blockchain, // Blockchain (Coin)
        internalWallet.platform_options.network, // Network
        internalWallet.platform_id, //vaultId
        user._id // Label passed as extra information to tracking on 3rd party side
      );

      // Creating wallet in internal db
      return await CryptoWallet.create({
        address: newInternalWallet.data.item.address,
        owner_type: WALLET_OWNER.USER,
        owner: user._id,
        currency_code,
      });
    }
  } catch (err) {
    console.log(err);
    throw new WalletError(
      "Some error occured. Please contact customer support."
    );
  }
}

// ------------------------- Exports -------------------------

module.exports = generateDepositAddressService;
