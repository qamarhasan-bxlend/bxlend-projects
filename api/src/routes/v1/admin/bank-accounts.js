"use strict";

const { showBankAccountsAdminV1, listBankAccountsAdminV1, reviewBankAccountsAdminV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listBankAccountsAdminV1));

router.route("/:bank_account_id")
  .get(wrapController(showBankAccountsAdminV1));

router.route("/:bank_account_id")
  .patch(wrapController(reviewBankAccountsAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/bank-accounts", router);