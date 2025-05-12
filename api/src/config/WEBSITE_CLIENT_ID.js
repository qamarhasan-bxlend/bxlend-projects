"use strict";

const assert = require("assert");

const WEBSITE_CLIENT_ID = process.env.WEBSITE_CLIENT_ID || null;

assert(
  typeof WEBSITE_CLIENT_ID === "string",
  "Expected <WEBSITE_CLIENT_ID> to be a valid string",
);

module.exports = WEBSITE_CLIENT_ID;
