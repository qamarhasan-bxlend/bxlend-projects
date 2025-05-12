"use strict";

const { vaultodyTransactionStatusUpdateV1, incominMined } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Subscription -------------------------

router.route("/transaction-updates")
  .post(wrapController(vaultodyTransactionStatusUpdateV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/vaultody", router);
