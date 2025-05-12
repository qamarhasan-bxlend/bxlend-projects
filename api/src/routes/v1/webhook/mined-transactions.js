"use strict";

const { incomingCoinMinedTransactionV1  } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Subscription -------------------------

router.route("/incoming/coin")
.post(wrapController(incomingCoinMinedTransactionV1));


// ------------------------- Exports -------------------------

module.exports = Router().use("/mined-transactions", router);
