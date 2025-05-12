"use strict";

const assert = require("assert");

const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET || null;

assert(
  typeof VONAGE_API_SECRET === "string",
  "Expected <VONAGE_API_SECRET> to be a valid string",
);

module.exports = VONAGE_API_SECRET;
