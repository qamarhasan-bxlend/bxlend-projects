"use strict";

const assert = require("assert");

const VONAGE_APPLICATION_ID = process.env.VONAGE_APPLICATION_ID || null;

assert(
  typeof VONAGE_APPLICATION_ID === "string",
  "Expected <VONAGE_APPLICATION_ID> to be a valid string",
);

module.exports = VONAGE_APPLICATION_ID;
