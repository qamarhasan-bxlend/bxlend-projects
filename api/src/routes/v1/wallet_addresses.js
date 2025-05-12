"use strict";

const { currencyParam, listWalletsV1,listWalletAddressesV1, showWalletAddressesV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Params -------------------------

router.param("currency", wrapController(currencyParam));

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listWalletAddressesV1));

router.route("/:currency")
  .get(wrapController(showWalletAddressesV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/wallet_addresses", router);
