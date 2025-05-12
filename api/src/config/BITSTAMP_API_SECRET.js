"use strict";

const assert = require("assert");

const BITSTAMP_API_SECRET = process.env.BITSTAMP_API_SECRET || null;

assert(
  typeof BITSTAMP_API_SECRET === "string",
  "Expected <BITSTAMP_API_SECRET> to be a valid string",
);

module.exports = BITSTAMP_API_SECRET;
