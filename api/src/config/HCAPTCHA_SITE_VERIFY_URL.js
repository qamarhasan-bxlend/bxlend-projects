"use strict";

const assert = require("assert");

const HCAPTCHA_SITE_VERIFY_URL = process.env.HCAPTCHA_SITE_VERIFY_URL || null;

assert(
  typeof HCAPTCHA_SITE_VERIFY_URL === "string",
  "Expected <HCAPTCHA_SITE_VERIFY_URL> to be a valid string",
);

module.exports = HCAPTCHA_SITE_VERIFY_URL;