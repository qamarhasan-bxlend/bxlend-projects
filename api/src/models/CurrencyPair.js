"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("@src/constants");
const { assert: { isNumeric } } = require("@src/utils");
const { Schema, model, Types } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    currency_codes: {
      type: [String],
      required: true,
      validate: value => value.length === 2,
    },
    symbol: {
      type: String,
      required: true,
    },
    price: {
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
    collection: COLLECTION.CURRENCY_PAIR,
    timestamps: TIMESTAMPS,
  },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize currency pair object.
   *
   * @memberOf MODEL
   * @param {Object} pair
   * @returns {Object}
   */
  serialize(pair) {
    const {
      id,
      currency_codes,
      symbol,
      price,
      created_at,
      updated_at,
    } = pair;

    return {
      id,
      currencies: pair.currencies ?? currency_codes,
      symbol,
      price,
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
    return ["id", "currencies", "symbol", "created_at", "updated_at"];
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize currency pair object.
   *
   * @memberOf SCHEMA.prototype
   * @returns {Object}
   */
  serialize() {
    return MODEL.serialize(this);
  },
});

// ------------------------- Relations --------------------------

SCHEMA.virtual("currencies", {
  ref: NAME.CURRENCY,
  localField: "currency_codes",
  foreignField: "code",
  justOne: false,
});

// ------------------------- Settings ---------------------------

SCHEMA.set("toJSON", {
  /**
   * Serialize currency pair object.
   *
   * @param {SCHEMA} doc
   * @returns {Object}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.CURRENCY_PAIR, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * tags:
 *   name: currency_pair_model
 *   x-displayName: The Currency Pair Model
 *   description: |
 *     <SchemaDefinition schemaRef="#/definitions/CurrencyPair" showReadOnly={true} showWriteOnly={true} />
 *
 * definitions:
 *   CurrencyPair:
 *     allOf:
 *       - $ref: "#/definitions/DBDocument"
 *       - type: object
 *         required:
 *           - currencies
 *           - symbol
 *         properties:
 *           currencies:
 *             description: Currencies in the pair
 *             type: array
 *             length: 2
 *             items:
 *               type: string
 *             example:
 *               - USDT
 *               - BTC
 *           symbol:
 *             description: Currency pair symbol
 *             type: string
 *             example: USDTBTC
 *
 * parameters:
 *   currency_pair_id_parameter:
 *     description: The currency pair identifier
 *     in: path
 *     name: currency_pair_id
 *     required: true
 *     schema:
 *       type: string
 *       format: ObjectId
 *       example: "a1b2c3d"
 *
 */
