"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("@src/constants");
const { Schema, model, Types } = require("mongoose");

// ------------------------- Schema -----------------------------
const SCHEMA = new Schema(
  {
    pair_symbol: {
      type: String,
      required: true,
    },
    from: {
      type: Schema.Types.Decimal128,
      required: true,
      get(value) {
        return value?.toString();
      },
      set(value) {
       
        return value
          ? Types.Decimal128.fromString(value)
          : Types.Decimal128.fromString("0");
      },
    },
    to: {
      type: Schema.Types.Decimal128,
      required: true,
      get(value) {
        return value?.toString();
      },
      set(value) {
       
        return value
          ? Types.Decimal128.fromString(value)
          : Types.Decimal128.fromString("0");
      },
    },
    high: {
      type: Schema.Types.Decimal128,
      required: true,
      get(value) {
        return value?.toString();
      },
      set(value) {
       
        return value
          ? Types.Decimal128.fromString(value)
          : Types.Decimal128.fromString("0");
      },
    },
    low: {
      type: Schema.Types.Decimal128,
      required: true,
      get(value) {
        return value?.toString();
      },
      set(value) {
       
        return value
          ? Types.Decimal128.fromString(value)
          : Types.Decimal128.fromString("0");
      },
    },
    percentage_change: {
      type: Schema.Types.Decimal128,
      required: true,
      get(value) {
        return value?.toString();
      },
      set(value) {
       
        return value
          ? Types.Decimal128.fromString(value)
          : Types.Decimal128.fromString("0");
      },
    },
    volume: {
      type: Schema.Types.Decimal128,
      required: true,
      get(value) {
        return value?.toString();
      },
      set(value) {
       
        return value
          ? Types.Decimal128.fromString(value)
          : Types.Decimal128.fromString("0");
      },
    },
    time: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: COLLECTION.TICKER,
    timestamps: TIMESTAMPS,
  }
);
// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize ticker object.
   *
   * @memberOf MODEL
   * @param {Object} ticker
   * @returns {Object}
   */
  serialize(ticker) {
    const { pair_symbol, from, to, high, low, time, created_at, updated_at } =
      ticker;

    return {
      pair: pair_symbol,
      from,
      to,
      high,
      low,
      time,
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
    return [
      "pair",
      "from",
      "to",
      "high",
      "low",
      "time",
      "created_at",
      "updated_at",
    ];
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize ticker object.
   *
   * @memberOf SCHEMA.prototype
   * @returns {Object}
   */
  serialize() {
    return MODEL.serialize(this);
  },
});

// ------------------------- Relations --------------------------

SCHEMA.virtual("pair", {
  ref: NAME.CURRENCY_PAIR,
  localField: "pair_symbol",
  foreignField: "symbol",
  justOne: true,
});

// ------------------------- Settings ---------------------------

SCHEMA.set("toJSON", {
  /**
   * Serialize ticker object.
   *
   * @param {SCHEMA} doc
   * @returns {Object}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.TICKER, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * tags:
 *   name: ticker_model
 *   x-displayName: The Ticker Model
 *   description: |
 *     <SchemaDefinition schemaRef="#/definitions/Ticker" showReadOnly={true} showWriteOnly={true} />
 *
 * definitions:
 *   Ticker:
 *     type: object
 *     required:
 *       - pair
 *       - from
 *       - to
 *       - high
 *       - low
 *       - time
 *       - created_at
 *     properties:
 *       pair:
 *         description: Currency pair symbol
 *         type: string
 *         example: USDTBTC
 *       from:
 *         description: Ticker open price
 *         type: string
 *         example: "34465.23"
 *       to:
 *         description: Ticker close price
 *         type: string
 *         example: "35465.23"
 *       high:
 *         description: Ticker highest price
 *         type: string
 *         example: "36846.867"
 *       low:
 *         description: Ticker lowest price
 *         type: string
 *         example: "30846.867"
 *       time:
 *         description: Ticker time
 *         type: string
 *         readOnly: true
 *         format: date-time
 *         example: 2021-07-21T17:32:28Z
 *       created_at:
 *         description: Document's creation date-time
 *         type: string
 *         readOnly: true
 *         format: date-time
 *         example: 2017-07-21T17:32:28Z
 *       updated_at:
 *         description: Document's update date-time
 *         type: string
 *         readOnly: true
 *         format: date-time
 *         example: 2017-07-21T17:32:28Z
 *
 * parameters:
 *   ticker_id_parameter:
 *     description: The ticker identifier
 *     in: path
 *     name: ticker_id
 *     required: true
 *     schema:
 *       type: string
 *       format: ObjectId
 *       example: "a1b2c3d"
 *
 */
