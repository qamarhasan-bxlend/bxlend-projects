"use strict";

const { blockchainParam, currencyCodeParam, showDepositAddressesV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Params -------------------------

router.param("currency_code", wrapController(currencyCodeParam));
router.param("blockchain", wrapController(blockchainParam));

// ------------------------- Country -------------------------

router.route("/:blockchain/:currency_code")
  .get(wrapController(showDepositAddressesV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/deposit_addresses", router);
