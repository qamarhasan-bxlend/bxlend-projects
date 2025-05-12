"use strict";

const assert = require("assert");

const KRAKEN_PRIVATE_KEY = process.env.KRAKEN_PRIVATE_KEY || null;

assert(
  typeof KRAKEN_PRIVATE_KEY === "string",
  "Expected <KRAKEN_PRIVATE_KEY> to be a valid string",
);

module.exports = KRAKEN_PRIVATE_KEY;
