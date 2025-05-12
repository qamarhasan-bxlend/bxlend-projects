"use strict";

const { ENV } = require("@src/constants");
const assert = require("assert");
const NODE_ENV = require("./NODE_ENV");

const SENTRY_DSN = process.env.SENTRY_DSN || null;

/* istanbul ignore next */
if (NODE_ENV === ENV.PRODUCTION) {
  assert(
    typeof SENTRY_DSN === "string",
    "Expected <SENTRY_DSN> to be a valid string",
  );
}

module.exports = SENTRY_DSN;
