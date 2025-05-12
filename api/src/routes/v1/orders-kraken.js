"use strict";

const { currencyPairParam, createOrderKrakenV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Params -------------------------

router.param("currency_pair", wrapController(currencyPairParam));

// ------------------------- Country -------------------------

  router.route("/:currency_pair")
  .post(wrapController(createOrderKrakenV1));
  
// ------------------------- Exports -------------------------

module.exports = Router().use("/orders-kraken", router);
