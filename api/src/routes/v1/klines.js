"use strict";

const { currencyPairParam, listKlinesV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Params -------------------------

router.param("currency_pair", wrapController(currencyPairParam));

// ------------------------- Country -------------------------

router.route("/:currency_pair")
  .get(wrapController(listKlinesV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/klines", router);