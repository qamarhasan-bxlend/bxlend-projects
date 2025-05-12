"use strict";

const assert = require("assert");

const SCRYPT_API_SECRET = process.env.SCRYPT_API_SECRET || null;

assert(
  typeof SCRYPT_API_SECRET === "string",
  "Expected <SCRYPT_API_SECRET> to be a string",
);

module.exports = SCRYPT_API_SECRET;
