"use strict";

const { ENV } = require("@src/constants");
const assert = require("assert");
const NODE_ENV = require("./NODE_ENV");

const SCRYPT_WS_URI = process.env.SCRYPT_WS_URI || null;

/* istanbul ignore next */
if (NODE_ENV !== ENV.TEST) {
  assert(
    typeof SCRYPT_WS_URI === "string",
    "Expected <SCRYPT_WS_URI> to be a valid string",
  );
}

module.exports = SCRYPT_WS_URI;
