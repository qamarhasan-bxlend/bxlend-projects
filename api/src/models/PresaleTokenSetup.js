"use strict";

const { Schema, Types, model } = require("mongoose");
const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("@src/constants");
const { assert: { isNumeric } } = require("@src/utils");

// ------------------------- Presale Token Setup Schema -----------------------------

const SCHEMA = new Schema(
  {
    total_tokens: {
      type: Number,
      required: true,
    },
    purchased_tokens: {
      type: Number,
      required: true,
    },
    queued_tokens: {
      type: Number,
      required: true,
    },
    base_price: {
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
    current_stage: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return this.base_price_for_each_stage.some(stage => stage.stage === value);
        },
        message: "current_stage must match one of the stages defined in base_price_for_each_stage."
      }
    },
    base_price_for_each_stage: [{
      stage: { type: Number, required: true, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      triggering_amount: { required: true, type: Number },
      price_increment: { required: true, type: Number }
    }
    ],
    supported_payment_options: [
      {
        blockchain: { type: String, required: true },
        deposit_address: { type: String, required: true }, // User will receive this address to deposit money
        supported_coins: []
      }
    ],
    minimum_deposit: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true }
    },
    discounts: [
      {
        minimum_buy: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    collection: COLLECTION.PRESALE_TOKEN_SETUP,
    timestamps: TIMESTAMPS,
  }
);

const MODEL = model(NAME.PRESALE_TOKEN_SETUP, SCHEMA);

module.exports = MODEL;
