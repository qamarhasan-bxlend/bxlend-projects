"use strict";

const assert = require("assert");

const API_URI = process.env.API_URI || null;

assert(
  typeof API_URI === "string",
  "Expected <API_URI> to be a valid string",
);

module.exports = API_URI;
