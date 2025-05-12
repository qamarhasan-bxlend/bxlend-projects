"use strict";

const { MODEL: NAME, TRANSACTION_KIND, DISCRIMINATOR } = require("@src/constants");
const { assert: { isNumeric } } = require("@src/utils");
const { Schema, Types } = require("mongoose");
const Transaction = require("./Transaction");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    from: {
      type: Types.ObjectId,
      required: true,
      ref: NAME.WALLET,
    },
    to: {
      type: Types.ObjectId,
      required: true,
      ref: NAME.WALLET,
    },
    orders: {
      type: [{
        type: Types.ObjectId,
        ref: NAME.ORDER,
      }],
      required: true,
      validate: value => value.length === 2,
    },
    pair_symbol: {
      type: String,
      required: true,
    },
    price: {
      type: Schema.Types.Decimal128,
      required: true,
      validate: isNumeric,
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

SCHEMA.virtual("pair", {
  ref: NAME.CURRENCY_PAIR,
  localField: "pair_symbol",
  foreignField: "symbol",
  justOne: true,
});

// ------------------------- Settings ---------------------------

// ------------------------- Model ------------------------------

const MODEL = Transaction.discriminator(NAME.TRANSFER_TRANSACTION, SCHEMA, TRANSACTION_KIND.TRANSFER);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   TransferTransaction:
 *     allOf:
 *       - $ref: "#/definitions/Transaction"
 *       - type: object
 *         required:
 *           - from
 *           - to
 *           - orders
 *           - pair
 *           - price
 *         properties:
 *           from:
 *             description: Transfer Transaction source waller
 *             type: string
 *             format: ObjectId
 *             example: "a1b2c3d"
 *           to:
 *             description: Transfer Transaction target waller
 *             type: string
 *             format: ObjectId
 *             example: "a1b2c3d"
 *           orders:
 *             description: Triggering orders
 *             type: string
 *             items:
 *               type: string
 *               format: ObjectId
 *               example: "a1b2c3d"
 *           pair:
 *             description: Triggering currency pair symbol
 *             type: string
 *             example: USDTETH
 *           price:
 *             description: Calculated price
 *             type: string
 *             example: "2.23557"
 *
 */
