"use strict";

const { listUsersOrdersAdminV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listUsersOrdersAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/orders", router);