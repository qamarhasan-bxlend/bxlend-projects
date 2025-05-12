"use strict";

const assert = require("assert");
const { isUri } = require("@src/utils/assert");

const BITGO_API_URI = process.env.BITGO_API_URI || null;

assert(
  typeof BITGO_API_URI === "string",
  "Expected <BITGO_API_URI> to be a string",
);

assert(
  isUri(BITGO_API_URI),
  "Expected <BITGO_API_URI> to be valid uri",
);

module.exports = BITGO_API_URI;
