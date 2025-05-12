"use strict";

const { listKycDashboardAdminV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- users -------------------------

router.route("/")
  .get(wrapController(listKycDashboardAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/kyc", router);