"use strict";

const assert = require("assert");

const KRAKEN_API_KEY = process.env.KRAKEN_API_KEY || null;

assert(
  typeof KRAKEN_API_KEY === "string",
  "Expected <KRAKEN_API_KEY> to be a valid string",
);

module.exports = KRAKEN_API_KEY;
