"use strict";

const assert = require("assert");

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || null;

assert(
  typeof TWILIO_ACCOUNT_SID === "string",
  "Expected <TWILIO_ACCOUNT_SID> to be a valid string",
);

module.exports = TWILIO_ACCOUNT_SID;
