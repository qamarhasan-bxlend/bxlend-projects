"use strict";

const assert = require("assert");

const WEBSITE_CLIENT_SECRET = process.env.WEBSITE_CLIENT_SECRET || null;

assert(
  typeof WEBSITE_CLIENT_SECRET === "string",
  "Expected <WEBSITE_CLIENT_SECRET> to be a valid string",
);

module.exports = WEBSITE_CLIENT_SECRET;
