"use strict";

const assert = require("assert");

const  COIN_CONVERT_HTTP_API_URL = process.env.COIN_CONVERT_HTTP_API_URL || null;

assert(
  typeof COIN_CONVERT_HTTP_API_URL === "string",
  "Expected <COIN_CONVERT_HTTP_API_URL> to be a valid string",
);

module.exports = COIN_CONVERT_HTTP_API_URL;
