"use strict";

const { currencyParam, listWalletsV1, showWalletV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Params -------------------------

router.param("currency", wrapController(currencyParam));

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listWalletsV1));

router.route("/:currency")
  .get(wrapController(showWalletV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/wallets", router);
