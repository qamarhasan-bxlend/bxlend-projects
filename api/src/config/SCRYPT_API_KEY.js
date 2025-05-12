"use strict";

const assert = require("assert");

const SCRYPT_API_KEY = process.env.SCRYPT_API_KEY || null;

assert(
  typeof SCRYPT_API_KEY === "string",
  "Expected <SCRYPT_API_KEY> to be a string",
);

module.exports = SCRYPT_API_KEY;
