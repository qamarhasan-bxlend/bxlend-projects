"use strict";

const assert = require("assert");

const BITSTAMP_HTTP_API_URL = process.env.BITSTAMP_HTTP_API_URL || null;

assert(
  typeof BITSTAMP_HTTP_API_URL === "string",
  "Expected <BITSTAMP_HTTP_API_URL> to be a valid string",
);

module.exports = BITSTAMP_HTTP_API_URL;
