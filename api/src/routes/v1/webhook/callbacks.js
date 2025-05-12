"use strict";

const { callbackCoinTransactionRequestV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Subscription -------------------------

router.route("/coin-transaction-request")
  .post(wrapController(callbackCoinTransactionRequestV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/callback", router);
