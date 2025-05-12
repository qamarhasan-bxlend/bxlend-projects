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
      enum: [VERIFICATION_PLATFORM.MAILGUN],
      default: VERIFICATION_PLATFORM.MAILGUN,
      required: true,
    },
    input_type: {
      type: String,
      enum: [VERIFICATION_INPUT_TYPE.WAITING_LIST_USERS],
      default: VERIFICATION_INPUT_TYPE.WAITING_LIST_USERS,
      required: true,
    },
    token: {
      type: String,
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

const MODEL = Verification.discriminator(NAME.WAITING_LIST_USERS_VERIFICATION, SCHEMA, VERIFICATION_KIND.MAILGUN_EMAIL);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
