"use strict";

const assert = require("assert");

const ADMIN_CLIENT_SECRET = process.env.ADMIN_CLIENT_SECRET || null;

assert(
  typeof ADMIN_CLIENT_SECRET === "string",
  "Expected <ADMIN_CLIENT_SECRET> to be a valid string",
);

module.exports = ADMIN_CLIENT_SECRET;
