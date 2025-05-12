"use strict";

const assert = require("assert");

const ADMIN_CLIENT_REDIRECT_URI = process.env.ADMIN_CLIENT_REDIRECT_URI || null;

assert(
  typeof ADMIN_CLIENT_REDIRECT_URI === "string",
  "Expected <ADMIN_CLIENT_REDIRECT_URI> to be a valid string",
);

module.exports = ADMIN_CLIENT_REDIRECT_URI;
