"use strict";

const assert = require("assert");

const VAULTODY_API_SECRET = process.env.VAULTODY_API_SECRET || null;

assert(
  typeof VAULTODY_API_SECRET === "string",
  "Expected <VAULTODY_API_SECRET> to be a string",
);



module.exports = VAULTODY_API_SECRET;
