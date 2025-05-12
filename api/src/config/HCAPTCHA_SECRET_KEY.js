"use strict";

const assert = require("assert");

const HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY || null;

assert(
  typeof HCAPTCHA_SECRET_KEY === "string",
  "Expected <HCAPTCHA_SECRET_KEY> to be a valid string",
);

module.exports = HCAPTCHA_SECRET_KEY;