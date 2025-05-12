"use strict";

const { currencyPairParam, listOrderBookV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Params -------------------------

router.param("currency_pair", wrapController(currencyPairParam));

// ------------------------- Country -------------------------

router.route("/:currency_pair")
  .get(wrapController(listOrderBookV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/order-book", router);