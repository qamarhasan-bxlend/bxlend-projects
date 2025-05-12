"use strict";

const { currencyPairParam, listCurrencyPairsV1, showCurrencyPairV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Params -------------------------

router.param("currency_pair", wrapController(currencyPairParam));

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listCurrencyPairsV1));

router.route("/:currency_pair")
  .get(wrapController(showCurrencyPairV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/currency-pairs", router);
