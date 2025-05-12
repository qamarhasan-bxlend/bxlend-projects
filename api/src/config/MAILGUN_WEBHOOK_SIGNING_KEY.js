"use strict";

const assert = require("assert");

const MAILGUN_WEBHOOK_SIGNING_KEY = process.env.MAILGUN_WEBHOOK_SIGNING_KEY || null;

assert(
  typeof MAILGUN_WEBHOOK_SIGNING_KEY === "string",
  "Expected <MAILGUN_WEBHOOK_SIGNING_KEY> to be a valid string",
);

module.exports = MAILGUN_WEBHOOK_SIGNING_KEY;
