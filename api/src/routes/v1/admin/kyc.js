"use strict";

const { updateKycAdminV1Controller, showKycAdminV1Controller, listKycRequestsAdminV1Controller } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listKycRequestsAdminV1Controller));

router.route("/:kyc_id")
  .get(wrapController(showKycAdminV1Controller))
  .patch(wrapController(updateKycAdminV1Controller));

// ------------------------- Exports -------------------------

module.exports = Router().use("/kyc", router);