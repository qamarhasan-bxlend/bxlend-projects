"use strict";

const assert = require("assert");

const WEBSITE_CLIENT_REDIRECT_URI = process.env.WEBSITE_CLIENT_REDIRECT_URI || null;

assert(
  typeof WEBSITE_CLIENT_REDIRECT_URI === "string",
  "Expected <WEBSITE_CLIENT_REDIRECT_URI> to be a valid string",
);

module.exports = WEBSITE_CLIENT_REDIRECT_URI;
