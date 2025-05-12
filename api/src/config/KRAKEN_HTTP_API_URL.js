"use strict";

const assert = require("assert");

const KRAKEN_HTTP_API_URL = process.env.KRAKEN_HTTP_API_URL || null;

assert(
  typeof KRAKEN_HTTP_API_URL === "string",
  "Expected <KRAKEN_HTTP_API_URL> to be a valid string",
);

module.exports = KRAKEN_HTTP_API_URL;
