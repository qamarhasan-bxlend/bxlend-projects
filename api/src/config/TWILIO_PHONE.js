"use strict";

const assert = require("assert");

const TWILIO_PHONE = process.env.TWILIO_PHONE || null;

assert(
  typeof TWILIO_PHONE === "string",
  "Expected <TWILIO_PHONE> to be a valid string",
);

module.exports = TWILIO_PHONE;
