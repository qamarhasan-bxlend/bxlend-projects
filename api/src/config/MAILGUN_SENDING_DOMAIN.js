"use strict";

const assert = require("assert");

const MAILGUN_SENDING_DOMAIN = process.env.MAILGUN_SENDING_DOMAIN || null;

assert(
  typeof MAILGUN_SENDING_DOMAIN === "string",
  "Expected <MAILGUN_SENDING_DOMAIN> to be a valid string",
);

module.exports = MAILGUN_SENDING_DOMAIN;
