"use strict";

const { listBankAccountsDashboardAdminV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// -------------------------bank_accounts-------------------------

router.route("/")
  .get(wrapController(listBankAccountsDashboardAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/bank-accounts", router);