"use strict";

const { listCountriesV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listCountriesV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/countries", router);
