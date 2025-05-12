"use strict";

const assert = require("assert");

const VAULTODY_API_PASSPHRASE = process.env.VAULTODY_API_PASSPHRASE || null;

assert(
  typeof VAULTODY_API_PASSPHRASE === "string",
  "Expected <VAULTODY_API_PASSPHRASE> to be a string",
);

module.exports = VAULTODY_API_PASSPHRASE;
