"use strict";

const { Router } = require("express");
const confirmedTransactions = require("./confirmed-transactions");
const minedTransactions = require("./mined-transactions");
const callbacks = require("./callbacks");
const vaultody = require("./vaultody");

const router = Router();

router
  .use(confirmedTransactions)
  .use(minedTransactions)
  .use(callbacks)
  .use(vaultody);

module.exports = Router().use("/webhook", router);