"use strict";

const assert = require("assert");

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || null;

assert(
  typeof TWILIO_AUTH_TOKEN === "string",
  "Expected <TWILIO_AUTH_TOKEN> to be a valid string",
);

module.exports = TWILIO_AUTH_TOKEN;
