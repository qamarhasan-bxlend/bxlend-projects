"use strict";

const assert = require("assert");

const WEBSITE_CLIENT_URI = process.env.WEBSITE_CLIENT_URI || null;

assert(
  typeof WEBSITE_CLIENT_URI === "string",
  "Expected <WEBSITE_CLIENT_URI> to be a valid string",
);

module.exports = WEBSITE_CLIENT_URI;
