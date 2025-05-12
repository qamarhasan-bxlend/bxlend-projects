"use strict";

const assert = require("assert");
const { isUri } = require("@src/utils/assert");

const VAULTODY_API_URI = process.env.VAULTODY_API_URI || null;

assert(
  typeof VAULTODY_API_URI === "string",
  "Expected <VAULTODY_API_URI> to be a string",
);

assert(
  isUri(VAULTODY_API_URI),
  "Expected <VAULTODY_API_URI> to be valid uri",
);

module.exports = VAULTODY_API_URI;
