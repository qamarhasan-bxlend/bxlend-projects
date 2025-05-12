"use strict";

const {
  showBankAccountV1,
  listBankAccountsV1,
  createBankAccountV1,
  updateBankAccountV1,
  removeBankAccountV1,
} = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Country -------------------------

router.route("/").get(wrapController(listBankAccountsV1));
router.route("/").post(wrapController(createBankAccountV1));
router.route("/:bank_account_id").get(wrapController(showBankAccountV1));
router.route("/:bank_account_id").delete(wrapController(removeBankAccountV1));
router.route("/:bank_account_id").patch(wrapController(updateBankAccountV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/bank-accounts", router);
