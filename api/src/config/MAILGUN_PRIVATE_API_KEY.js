"use strict";

const assert = require("assert");

const MAILGUN_PRIVATE_API_KEY = process.env.MAILGUN_PRIVATE_API_KEY || null;

assert(
  typeof MAILGUN_PRIVATE_API_KEY === "string",
  "Expected <MAILGUN_PRIVATE_API_KEY> to be a valid string",
);

module.exports = MAILGUN_PRIVATE_API_KEY;
