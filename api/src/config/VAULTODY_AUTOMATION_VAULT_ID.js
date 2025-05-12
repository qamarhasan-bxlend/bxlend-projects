"use strict";

const assert = require("assert");
const { isObjectId } = require("@src/utils/assert");

const VAULTODY_AUTOMATION_VAULT_ID = process.env.VAULTODY_AUTOMATION_VAULT_ID ;

assert(
  typeof VAULTODY_AUTOMATION_VAULT_ID === "string",
  "Expected <VAULTODY_AUTOMATION_VAULT_ID> to be a string",
);

assert(
  isObjectId(VAULTODY_AUTOMATION_VAULT_ID),
  "Expected <VAULTODY_AUTOMATION_VAULT_ID> to be valid ( only contains a~z or 0~9 characters )",
);

module.exports = VAULTODY_AUTOMATION_VAULT_ID;
