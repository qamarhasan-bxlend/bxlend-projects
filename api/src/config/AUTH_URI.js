"use strict";

const assert = require("assert");

const AUTH_URI = process.env.AUTH_URI || null;

assert(
  typeof AUTH_URI === "string",
  "Expected <AUTH_URI> to be a valid string",
);

module.exports = AUTH_URI;
