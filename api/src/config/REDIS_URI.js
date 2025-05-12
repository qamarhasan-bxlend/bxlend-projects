"use strict";

const { ENV } = require("@src/constants");
const assert = require("assert");
const NODE_ENV = require("./NODE_ENV");

const REDIS_URI = process.env.REDIS_URI || null;

/* istanbul ignore next */
if (NODE_ENV !== ENV.TEST) {
  assert(
    typeof REDIS_URI === "string",
    "Expected <REDIS_URI> to be a valid string",
  );
}

module.exports = REDIS_URI;
