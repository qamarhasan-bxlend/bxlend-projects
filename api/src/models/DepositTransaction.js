"use strict";

const { MODEL: NAME, TRANSACTION_KIND, DISCRIMINATOR } = require("@src/constants");
const { Schema, Types } = require("mongoose");
const Transaction = require("./Transaction");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    to: {
      type: Types.ObjectId,
      required: true,
      ref: NAME.WALLET,
    },
    crypto_transaction_id :{
      type : String
    }
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

const MODEL = Transaction.discriminator(NAME.DEPOSIT_TRANSACTION, SCHEMA, TRANSACTION_KIND.DEPOSIT);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   DepositTransaction:
 *     allOf:
 *       - $ref: "#/definitions/Transaction"
 *       - type: object
 *         required:
 *           - to
 *         properties:
 *           to:
 *             description: Deposit Transaction target waller
 *             type: string
 *             format: ObjectId
 *             example: "a1b2c3d"
 *
 */
