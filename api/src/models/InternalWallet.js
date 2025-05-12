"use strict";

const { MODEL: NAME, WALLET_KIND, DISCRIMINATOR, CRYPTO_WALLET_PLATFORM } = require("@src/constants");
const { Schema } = require("mongoose");
const Wallet = require("./Wallet");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    address: {
      type: String,
    },
    platform: {
      type: String,
      required: true,
      enum: Object.values(CRYPTO_WALLET_PLATFORM),
      default: CRYPTO_WALLET_PLATFORM.CRYPTOAPIS, // TODO: remove in case of multiple platforms
    },
    platform_id: {
      // Wallet id in the specified platform.
      type: String,
      required: true,
    },
    platform_options: {
      type: Schema.Types.Mixed,
    },
  },
  {
    discriminatorKey: DISCRIMINATOR,
  },
);

// ------------------------- Statics ----------------------------

// ------------------------- Methods ----------------------------

// ------------------------- Relations --------------------------

// ------------------------- Settings ---------------------------

// ------------------------- Model ------------------------------

const MODEL = Wallet.discriminator(NAME.INTERNAL_WALLET, SCHEMA, WALLET_KIND.INTERNAL);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   InternalWallet:
 *     allOf:
 *       - $ref: "#/definitions/Wallet"
 *       - type: object
 *         required:
 *           - address
 *         properties:
 *           address:
 *             description: Wallet's address (only present in crypto wallets)
 *             type: string
 *             example: "0x0000000000000"
 *
 */
