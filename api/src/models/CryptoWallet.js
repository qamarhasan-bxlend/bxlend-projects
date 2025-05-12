"use strict";

const { MODEL: NAME, WALLET_KIND, DISCRIMINATOR, WALLET_OWNER } = require("@src/constants");
const { assert: { isNumeric } } = require("@src/utils");
const { Schema, Types } = require("mongoose");
const Wallet = require("./Wallet");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    owner_type: {
      type: String,
      required: true,
      enum: Object.values(WALLET_OWNER),
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "owner_type",
    },
    address: {
      type: String,
      required: false,
    },
    available_balance: {
      type: Schema.Types.Decimal128,
      required: true,
      validate: isNumeric,
      default() { // TODO: update in case the new order or deposit/withdraw.
        return this.balance;
      },
      get(value) {
        return value?.toString();
      },
      set(value) {
        return Types.Decimal128.fromString(value);
      },
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

const MODEL = Wallet.discriminator(NAME.CRYPTO_WALLET, SCHEMA, WALLET_KIND.CRYPTO);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   CryptoWallet:
 *     allOf:
 *       - $ref: "#/definitions/Wallet"
 *       - type: object
 *         required:
 *           - owner_type
 *           - owner
 *           - address
 *           - available_balance
 *         properties:
 *           owner_type:
 *             description: Wallet owner type
 *             type: string
 *             enum:
 *               - User
 *               - Client
 *           owner:
 *             description: Wallet owner id
 *             type: string
 *             format: ObjectId
 *             example: "a1b2c3d"
 *           address:
 *             description: Wallet's address (only present in crypto wallets)
 *             type: string
 *             example: "0x0000000000000"
 *           available_balance:
 *             description: Wallet available balance (not currently locked in order)
 *             type: string
 *             example: "2.23557"
 *
 */
