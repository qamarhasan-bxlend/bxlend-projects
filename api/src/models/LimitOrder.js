"use strict";

const { MODEL: NAME, ORDER_KIND, DISCRIMINATOR } = require("@src/constants");
const { assert: { isNumeric } } = require("@src/utils");
const { Schema, Types } = require("mongoose");
const Order = require("./Order");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    remainder: {
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
    limit_price: {
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
    fee: {
      type: {
        percentage: {
          type: Number,
          required: true,
        },
        amount: {
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
        remainder: {
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
      required: true,
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

const MODEL = Order.discriminator(NAME.LIMIT_ORDER, SCHEMA, ORDER_KIND.LIMIT);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   LimitOrder:
 *     allOf:
 *       - $ref: "#/definitions/Order"
 *       - type: object
 *         required:
 *           - remainder
 *           - limit_price
 *           - fee
 *         properties:
 *           remainder:
 *             description: Limit Order quantity
 *             type: string
 *             example: "2.23557"
 *           limit_price:
 *             description: Limit Order limit price
 *             type: string
 *             example: "2.23557"
 *           fee:
 *             description: Order fee
 *             type: object
 *             required:
 *               - percentage
 *               - amount
 *               - remainder
 *             properties:
 *               percentage:
 *                 description: Order fee percentage
 *                 type: number
 *                 format: float
 *                 example: 0.1
 *               amount:
 *                 description: Order fee amount
 *                 type: string
 *                 example: "0.0223557"
 *               remainder:
 *                 description: Order fee not collected yet
 *                 type: string
 *                 example: "0.0223557"
 *
 */
