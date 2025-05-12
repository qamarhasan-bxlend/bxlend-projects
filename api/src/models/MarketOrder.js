"use strict";

const { MODEL: NAME, ORDER_KIND, DISCRIMINATOR } = require("@src/constants");
const { Schema } = require("mongoose");
const Order = require("./Order");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {},
  {
    discriminatorKey: DISCRIMINATOR,
  },
);

// ------------------------- Statics ----------------------------

// ------------------------- Methods ----------------------------

// ------------------------- Relations --------------------------

// ------------------------- Settings ---------------------------

// ------------------------- Model ------------------------------

const MODEL = Order.discriminator(NAME.MARKET_ORDER, SCHEMA, ORDER_KIND.MARKET);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   MarketOrder:
 *     allOf:
 *       - $ref: "#/definitions/Order"
 *
 */
