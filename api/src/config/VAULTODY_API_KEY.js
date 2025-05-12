"use strict";

const assert = require("assert");
const { iscryptoapisApiKey } = require("@src/utils/assert");

const VAULTODY_API_KEY = process.env.VAULTODY_API_KEY || null;

assert(
  typeof VAULTODY_API_KEY === "string",
  "Expected <VAULTODY_API_KEY> to be a string",
);

assert(
  iscryptoapisApiKey(VAULTODY_API_KEY),
  "Expected <VAULTODY_API_KEY> to be valid ( only contains a~z or 0~9 characters )",
);

module.exports = VAULTODY_API_KEY;
