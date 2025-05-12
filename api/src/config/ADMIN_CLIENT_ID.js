"use strict";

const assert = require("assert");

const ADMIN_CLIENT_ID = process.env.ADMIN_CLIENT_ID || null;

assert(
  typeof ADMIN_CLIENT_ID === "string",
  "Expected <ADMIN_CLIENT_ID> to be a valid string",
);

module.exports = ADMIN_CLIENT_ID;
