"use strict";

const { listOrdersDashboardAdminV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Orders -------------------------

router.route("/")
  .get(wrapController(listOrdersDashboardAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/orders", router);