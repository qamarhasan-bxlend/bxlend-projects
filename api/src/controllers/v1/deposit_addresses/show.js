"use strict";

const { Joi } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const { Wallet, Currency } = require("@src/models");
const { union, pick } = require("lodash");
const Vaultody = require("@src/lib/Vaultody");
const { showOrCreateWalletService } = require("@src/services");
const { NODE_ENV } = require("@src/config");

const {
  WalletCurrencyUnsupported,
  BitgoForbiddenCountry,
  BitgoUnauthorizedError,
  Forbidden,
  HTTPError,
} = require("@src/errors");
const { STATUS_CODE, CRYPTO_WALLET_PLATFORM, ENV, NETWORK_TYPE } = require("@src/constants");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  validate({
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...Wallet.getSelectableFields()))
        .default([]),
    }),
  }),
  async function showDepositAddressV1Controller(req, res) {
    const {
      user,
      params: { blockchain },
      query: { select },
    } = req;

    let wallet;
    const currency = req.params.currency_code,
      toIncludeBefore = [];

    // Check if the currency supports the provided blockchain
    const isSupported = currency.supported_blockchains.some(b => {
      return b.blockchain.equals(blockchain._id) && b.deposit_options.is_allowed && !b.deposit_options.is_suspended;
    });
    console.log("🚀 ~ showDepositAddressV1Controller ~ isSupported:", isSupported)

    if (!isSupported) throw new WalletCurrencyUnsupported("Withrawals not supported on this Network");

    //Get the native currency of the selected blockchain
    const nativeCurrency = await Currency.findOne({ code: blockchain.native_currency });
    if (!nativeCurrency) throw new WalletCurrencyUnsupported("Native currency of blockchain not supported");
    console.log("🚀 ~ showDepositAddressV1Controller ~ nativeCurrency:", nativeCurrency)

    const currency_kind = nativeCurrency.kind;  // Use native currency
    const crypto_type = nativeCurrency.crypto_type;

    try {
      wallet = await showOrCreateWalletService({ user, currency_code: nativeCurrency.code, currency_kind, crypto_type }, null, {
        select: union(select, toIncludeBefore),
      });

      // Check if the wallet already has a deposit address
      if (wallet.address) {
        // Address exists, return it
        if (select && select.length) wallet = pick(wallet.toJSON(), select);
        return res.json({ wallet });
      }

      // Determine platform options based on environment
      let network;        
      if (NODE_ENV === ENV.DEVELOPMENT) {
        // Choose a test network (first non-mainnet network)
        network = blockchain.networks.find(n => n.network_type === NETWORK_TYPE.TESTNET);
        if (!network) throw new WalletCurrencyUnsupported("Test network not available");
      } else if (NODE_ENV === ENV.PRODUCTION) {
        // Choose mainnet and lowercase the network_name
        network = blockchain.networks.find(n => n.network_type === NETWORK_TYPE.MAINNET);
        if (!network) throw new WalletCurrencyUnsupported("Mainnet not available");
      }

      network.network_name = network.network_name.toLowerCase();  // Ensure lowercase

      // Generate a deposit address using Vaultody (or another platform in the future)
      const platform = blockchain.platforms.find(p => p.platform_name === CRYPTO_WALLET_PLATFORM.VAULTODY);
      if (!platform) throw new WalletCurrencyUnsupported("Platform not supported");

      const blockchainForVaultody = blockchain.vaultody_name.toLowerCase().replace(/\s+/g, '-');

      const newAddress = await Vaultody.createWalletAddress(
        blockchainForVaultody, // Native currency for blockchain
        network.network_name, // Network (mainnet/testnet)
        platform.platform_id, // Platform-specific vault ID
        user._id // User ID as label for tracking
      );
      console.log("🚀 ~ showDepositAddressV1Controller ~ newAddress:", newAddress)

      // Update wallet with the new deposit address
      wallet.address = newAddress.data.item.address;
      await wallet.save();

      if (select && select.length) wallet = pick(wallet.toJSON(), select);
      return res.json({ wallet,newAddress });

    } catch (error) {
      if (error instanceof WalletCurrencyUnsupported) throw error;
      else if (error instanceof BitgoForbiddenCountry) {
        throw new Forbidden("This action is banned in this country");
      } else if (error instanceof BitgoUnauthorizedError) {
        throw new HTTPError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal Server Error");
      }
      else {
        console.log(error);
        console.log(error.error.details);
        throw error
      }
    }
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/wallets:
 *   get:
 *     tags:
 *       - Currency
 *     description: Get currencies
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/page_query"
 *       - $ref: "#/parameters/limit_query"
 *       - description: "Select parameter"
 *         in: query
 *         name: select
 *         schema:
 *           type: string
 *           enum:
 *             - id
 *             - kind
 *             - code
 *             - name
 *             - display_decimals
 *             - symbol
 *             - country
 *             - decimals
 *             - icon
 *             - website
 *             - networks
 *             - created_at
 *             - updated_at
 *           default: []
 *           example:
 *             - code
 *             - name
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: The requested currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - currencies
 *                 - meta
 *               properties:
 *                 currencies:
 *                   type: array
 *                   items:
 *                     $ref: "#/definitions/Currency"
 *                 meta:
 *                   $ref: "#/definitions/Meta"
 *       400:
 *         $ref: "#/responses/400"
 *       401:
 *         $ref: "#/responses/401"
 *       500:
 *         $ref: "#/responses/500"
 */
