"use strict";

const { listReferralsAdminV1Controller } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listReferralsAdminV1Controller));

// ------------------------- Exports -------------------------

module.exports = Router().use("/referral", router);