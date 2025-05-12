"use strict";

const { currencyParam, currencyCodeParam, listCurrenciesV1, showCurrencyV1, showCurrencyByCodeV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Params -------------------------

router.param("currency", wrapController(currencyParam));
router.param("currency_code", wrapController(currencyCodeParam));

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listCurrenciesV1));

router.route("/:currency")
  .get(wrapController(showCurrencyV1));

router.route("/code/:currency_code")
  .get(wrapController(showCurrencyByCodeV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/currencies", router);
