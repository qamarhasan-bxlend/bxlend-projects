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
    stop_price: {
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

const MODEL = Order.discriminator(NAME.STOP_LIMIT_ORDER, SCHEMA, ORDER_KIND.STOP_LIMIT);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   StopLimitOrder:
 *     allOf:
 *       - $ref: "#/definitions/Order"
 *       - type: object
 *         required:
 *           - remainder
 *           - stop_price
 *           - limit_price
 *         properties:
 *           remainder:
 *             description: Limit Order quantity
 *             type: string
 *             example: "2.23557"
 *           stop_price:
 *             description: Stop Limit Order stop (trigger) price
 *             type: string
 *             example: "2.23557"
 *           limit_price:
 *             description: Stop Limit Order limit price
 *             type: string
 *             example: "2.23557"
 *
 */
