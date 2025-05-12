"use strict";

const { currencyPairParam, createOrderV1, showOrderV1, listOrderV1, removeOrderV1, createScryptOrderV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Params -------------------------

router.param("currency_pair", wrapController(currencyPairParam));

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listOrderV1));

router.route("/:order_id")
  .get(wrapController(showOrderV1));

router.route("/:order_id")
  .delete(wrapController(removeOrderV1));

// router.route("/:currency_pair")
//   .post(wrapController(createScryptOrderV1));

  router.route("/:currency_pair")
  .post(wrapController(createOrderV1));
  
// ------------------------- Exports -------------------------

module.exports = Router().use("/orders", router);
