"use strict";

const { listUsersDashboardAdminV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- users -------------------------

router.route("/")
  .get(wrapController(listUsersDashboardAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/users", router);