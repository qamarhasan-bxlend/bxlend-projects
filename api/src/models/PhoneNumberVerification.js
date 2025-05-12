"use strict";

const {
  MODEL: NAME,
  VERIFICATION_KIND,
  VERIFICATION_INPUT_TYPE,
  VERIFICATION_PLATFORM,
  DISCRIMINATOR,
} = require("@src/constants");
const { Schema } = require("mongoose");
const Verification = require("./Verification");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    platform: {
      type: String,
      enum: [VERIFICATION_PLATFORM.TWILIO],
      default: VERIFICATION_PLATFORM.TWILIO,
      required: true,
    },
    input_type: {
      type: String,
      enum: [VERIFICATION_INPUT_TYPE.PHONE_NUMBER],
      default: VERIFICATION_INPUT_TYPE.PHONE_NUMBER,
      required: true,
    },
    code: {
      type: String,
      required: true
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

const MODEL = Verification.discriminator(NAME.PHONE_NUMBER_VERIFICATION, SCHEMA, VERIFICATION_KIND.TWILIO_PHONE_NUMBER);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
