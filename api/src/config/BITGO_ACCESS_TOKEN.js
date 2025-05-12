"use strict";

const assert = require("assert");
const { isBitgoAccessToken } = require("@src/utils/assert");

const BTGO_ACCESS_TOKEN = process.env.BITGO_ACCESS_TOKEN || null;

assert(
  typeof BTGO_ACCESS_TOKEN === "string",
  "Expected <BTGO_ACCESS_TOKEN> to be a string",
);

assert(
  isBitgoAccessToken(BTGO_ACCESS_TOKEN),
  "Expected <BTGO_ACCESS_TOKEN> to be valid ( only contains a~z or 0~9 characters )",
);

module.exports = BTGO_ACCESS_TOKEN;
