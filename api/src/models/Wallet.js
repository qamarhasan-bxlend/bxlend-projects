"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS, WALLET_KIND, DISCRIMINATOR } = require("@src/constants");
const { assert: { isNumeric } } = require("@src/utils");
const { Schema, model, Types } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    [DISCRIMINATOR]: {
      type: String,
      enum: Object.values(WALLET_KIND),
      required: true,
    },
    currency_code: {
      type: String,
      required: true,
    },
    balance: {
      type: Schema.Types.Decimal128,
      required: true,
      default: "0",
      validate: isNumeric,
      get(value) {
        return value?.toString();
      },
      set(value) {
        return Types.Decimal128.fromString(value);
      },
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    collection: COLLECTION.WALLET,
    timestamps: TIMESTAMPS,
    discriminatorKey: DISCRIMINATOR,
  },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize wallet object.
   *
   * @memberOf MODEL
   * @param {Object} wallet
   * @returns {Object}
   */
  serialize(wallet) {
    const {
      id,
      owner_type,
      owner,
      currency_code,
      address,
      balance,
      available_balance,
      created_at,
      updated_at,
    } = wallet;

    return {
      id,
      owner_type,
      owner,
      currency: wallet.currency ?? currency_code,
      address,
      balance,
      available_balance,
      created_at,
      updated_at,
    };
  },

  /**
   * Returns fields that can be selected by query parameters.
   *
   * @returns {string[]}
   */
  getSelectableFields() {
    return ["id", "owner", "currency", "address", "balance", "created_at", "updated_at"];
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize wallet object.
   *
   * @memberOf SCHEMA.prototype
   * @returns {Object}
   */
  serialize() {
    return MODEL.serialize(this);
  },
});

// ------------------------- Relations --------------------------

SCHEMA.virtual("currency", {
  ref: NAME.CURRENCY,
  localField: "currency_code",
  foreignField: "code",
  justOne: true,
});

// ------------------------- Settings ---------------------------

SCHEMA.set("toJSON", {
  /**
   * Serialize wallet object.
   *
   * @param {SCHEMA} doc
   * @returns {Object}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.WALLET, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * tags:
 *   name: wallet_model
 *   x-displayName: The Wallet Model
 *   description: |
 *     <SchemaDefinition schemaRef="#/definitions/Wallet" showReadOnly={true} showWriteOnly={true} />
 *
 * definitions:
 *   Wallet:
 *     allOf:
 *       - $ref: "#/definitions/DBDocument"
 *       - type: object
 *         discriminator:
 *           propertyName: kind
 *           mapping:
 *             CRYPTO: "#/definitions/CryptoWallet"
 *             FIAT: "#/definitions/FiatWallet"
 *             INTERNAL: "#/definitions/InternalWallet"
 *         required:
 *           - kind
 *           - currency
 *           - balance
 *         properties:
 *           kind:
 *             description: Wallet kind
 *             type: string
 *             enum:
 *               - CRYPTO
 *               - FIAT
 *               - INTERNAL
 *           currency:
 *             description: Wallet currency
 *             type: string
 *             example: ETH
 *           balance:
 *             description: Wallet balance
 *             type: string
 *             example: "2.23557"
 *
 * parameters:
 *   wallet_id_parameter:
 *     description: The wallet identifier
 *     in: path
 *     name: wallet_id
 *     required: true
 *     schema:
 *       type: string
 *       format: ObjectId
 *       example: "a1b2c3d"
 *
 */
