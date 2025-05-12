"use strict";

const { coinConfirmedTransactionV1, tokenConfirmedTransactionV1, incomingTokenConfirmedTransactionV1, incomingCoinConfirmedTransactionV1  } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Subscription -------------------------

router.route("/token")
  .post(wrapController(tokenConfirmedTransactionV1));
  
router.route("/coin")
.post(wrapController(coinConfirmedTransactionV1));

router.route("/incoming/coin")
.post(wrapController(incomingCoinConfirmedTransactionV1));

router.route("/incoming/token")
.post(wrapController(incomingTokenConfirmedTransactionV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/confirmed-transactions", router);
