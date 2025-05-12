"use strict";

const assert = require("assert");
const { isUri } = require("@src/utils/assert");

const VAULTODY_WEBHOOK_URL = process.env.VAULTODY_WEBHOOK_URL || null;

assert(
  typeof VAULTODY_WEBHOOK_URL === "string",
  "Expected <VAULTODY_WEBHOOK_URL> to be a string",
);

assert(
  isUri(VAULTODY_WEBHOOK_URL),
  "Expected <VAULTODY_WEBHOOK_URL> to be valid ( only contains URLs )",
);

module.exports = VAULTODY_WEBHOOK_URL;
