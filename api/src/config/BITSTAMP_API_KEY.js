"use strict";

const assert = require("assert");

const BITSTAMP_API_KEY = process.env.BITSTAMP_API_KEY || null;

assert(
  typeof BITSTAMP_API_KEY === "string",
  "Expected <BITSTAMP_API_KEY> to be a valid string",
);

module.exports = BITSTAMP_API_KEY;
