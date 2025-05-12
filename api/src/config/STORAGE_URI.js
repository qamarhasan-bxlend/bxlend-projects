"use strict";

const assert = require("assert");

const STORAGE_URI = process.env.STORAGE_URI || null;

assert(
  typeof STORAGE_URI === "string",
  "Expected <STORAGE_URI> to be a valid string",
);

module.exports = STORAGE_URI;
