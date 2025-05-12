"use strict";

const assert = require("assert");

const VONAGE_API_KEY = process.env.VONAGE_API_KEY || null;

assert(
  typeof VONAGE_API_KEY === "string",
  "Expected <VONAGE_API_KEY> to be a valid string",
);

module.exports = VONAGE_API_KEY;
