"use strict";

const assert = require("assert");

const MAILGUN_PUBLIC_VALIDATION_KEY = process.env.MAILGUN_PUBLIC_VALIDATION_KEY || null;

assert(
  typeof MAILGUN_PUBLIC_VALIDATION_KEY === "string",
  "Expected <MAILGUN_PUBLIC_VALIDATION_KEY> to be a valid string",
);

module.exports = MAILGUN_PUBLIC_VALIDATION_KEY;
