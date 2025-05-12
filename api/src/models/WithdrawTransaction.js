"use strict";

const { MODEL: NAME, TRANSACTION_KIND, DISCRIMINATOR } = require("@src/constants");
const { Schema, Types } = require("mongoose");
const Transaction = require("./Transaction");
const { assert: { isNumeric } } = require("@src/utils");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    from: {
      type: Types.ObjectId,
      required: true,
      ref: NAME.WALLET,
    },
    recipient_address : {
      type : String,
    },
    vaultody_transaction_request_id :{
      type : String,
      required : true

    },
    vaultody_transaction_id :{
      type : String
    },
    fee: {
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

const MODEL = Transaction.discriminator(NAME.WITHDRAW_TRANSACTION, SCHEMA, TRANSACTION_KIND.WITHDRAW);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   WithdrawTransaction:
 *     allOf:
 *       - $ref: "#/definitions/Transaction"
 *       - type: object
 *         required:
 *           - from
 *         properties:
 *           from:
 *             description: Withdraw Transaction source waller
 *             type: string
 *             format: ObjectId
 *             example: "a1b2c3d"
 *
 */
