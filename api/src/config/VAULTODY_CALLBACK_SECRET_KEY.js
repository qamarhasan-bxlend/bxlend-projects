"use strict";

const assert = require("assert");
const { isObjectId } = require("@src/utils/assert");

const VAULTODY_CALLBACK_SECRET_KEY = process.env.VAULTODY_CALLBACK_SECRET_KEY || null;

assert(
  typeof VAULTODY_CALLBACK_SECRET_KEY === "string",
  "Expected <VAULTODY_CALLBACK_SECRET_KEY> to be a string",
);

module.exports = VAULTODY_CALLBACK_SECRET_KEY;
