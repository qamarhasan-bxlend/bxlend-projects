"use strict";

const { MODEL: NAME, CURRENCY_KIND, DISCRIMINATOR, CURRENCY_NETWORK, CRYPTO_TYPE } = require("@src/constants");
const { Schema, Types } = require("mongoose");
const Currency = require("./Currency");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    decimals: { // integer
      type: Number,
      min: 0,
      required: true,
    },
    /**
     * Object storage id.
     * should be stored as svg!
     *
     * @example "a1b2c3-a1b2c3-a1b2c3-a1b2c3"
     */
    icon: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    crypto_type: {
      type: String,
      enum: Object.values(CRYPTO_TYPE),
      required: true,
    },
    supported_blockchains: [
      {
        blockchain: {
          type: Types.ObjectId,
          ref: NAME.BLOCKCHAIN,  // Reference to Blockchain schema
          required: true,
        },
        contract_address: {
          type: String,  // Contract address for tokens on this blockchain
          required: function() { return this.crypto_type === 'token'; },  // Required for tokens
        },
        withdrawal_options: {
          is_allowed: {
            required: true,
            type: Boolean,
            default: true, // Default to true for general availability
          },
          is_suspended: {
            required: true,
            type: Boolean,
            default: false, // Default to false assuming no suspension initially
          },
        },
        deposit_options: {
          is_allowed: {
            required: true,
            type: Boolean,
            default: true, // Default to true for general availability
          },
          is_suspended: {
            required: true,
            type: Boolean,
            default: false, // Default to false assuming no suspension initially
          },
        },
      }
    ],
    /**
     * List of networks the cryptocurrency is supported in and can be withdrawn/deposited in
     *
     * @example ["ERC20"]
     */
    networks: {
      type: [{
        type: String,
        enum: Object.values(CURRENCY_NETWORK),
      }],
      required: false,
    },
  },
  {
    discriminatorKey: DISCRIMINATOR,
  },
);

SCHEMA.static({
  /**
   * Returns fields that can be selected by query parameters.
   *
   * @returns {string[]}
   */
  getSelectableFields() {
    return [
      "id",
      "kind",            // From Currency
      "code",            // From Currency
      "name",            // From Currency
      "display_decimals", // From Currency
      "decimals",        // Specific to CryptoCurrency
      "icon",            // Specific to CryptoCurrency
      "website",         // Specific to CryptoCurrency
      "crypto_type",     // Specific to CryptoCurrency
      "supported_blockchains.blockchain", // Reference to Blockchain
      "supported_blockchains.contract_address", // Contract address for tokens
      "supported_blockchains.withdrawal_options",
      "supported_blockchains.deposit_options",
      // "networks",        // Supported networks like ERC-20, BEP-20, etc.
      "created_at",      // From Currency
      "updated_at",      // From Currency
    ];
  },
});


// ------------------------- Statics ----------------------------

// ------------------------- Methods ----------------------------

// ------------------------- Relations --------------------------

// ------------------------- Settings ---------------------------

// ------------------------- Model ------------------------------

const MODEL = Currency.discriminator(NAME.CRYPTO_CURRENCY, SCHEMA, CURRENCY_KIND.CRYPTO);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   CryptoCurrency:
 *     allOf:
 *       - $ref: "#/definitions/Currency"
 *       - type: object
 *         required:
 *           - decimals
 *           - icon
 *           - website
 *           - networks
 *         properties:
 *           code:
 *             example: ETH
 *           name:
 *             example: Ethereum
 *           decimals:
 *             description: Currency decimals
 *             type: integer
 *             example: 18
 *           icon:
 *             description: Currency icon url
 *             type: string
 *             format: url
 *             example: https://static.btcex.pro/eth-icon.svg
 *           website:
 *             description: Currency official website
 *             type: string
 *             format: url
 *             example: https://ethereum.org
 *           networks:
 *             description: Currency supported networks
 *             type: array
 *             items:
 *               type: string
 *               enum:
 *                 - BTC
 *                 - ERC20
 *               example: ERC20
 *
 */
