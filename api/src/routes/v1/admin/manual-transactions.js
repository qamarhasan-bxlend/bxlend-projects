"use strict";

const {
  showManualTransactionAdminV1,
  listManualTransactionsAdminV1,
  showManualTransactionAttachmentAdminV1,

  showManualDepositTransactionAdminV1,
  listManualDepositTransactionsAdminV1,
  executeManualDepositTransactionAdminV1,

  showManualWithdrawTransactionAdminV1,
  listManualWithdrawTransactionsAdminV1,
  executeManualWithdrawTransactionAdminV1,

} = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();


// ------------------------- Deposit -------------------------

router.route("/deposit").get(wrapController(listManualDepositTransactionsAdminV1));

router.route("/deposit/:manual_transaction_id").get(wrapController(showManualDepositTransactionAdminV1));

router.route("/deposit/:manual_transaction_id/execute").patch(wrapController(executeManualDepositTransactionAdminV1));

// ------------------------- Withdraw ------------------------

router.route("/withdraw").get(wrapController(listManualWithdrawTransactionsAdminV1));

router.route("/withdraw/:manual_transaction_id").get(wrapController(showManualWithdrawTransactionAdminV1));

router.route("/withdraw/:manual_transaction_id/execute").patch(wrapController(executeManualWithdrawTransactionAdminV1));

// ------------------------- General -------------------------

router.route("/").get(wrapController(listManualTransactionsAdminV1));

router.route("/:manual_transaction_id").get(wrapController(showManualTransactionAdminV1));

router.route("/:manual_transaction_id/attachment/:attachment_id").get(wrapController(showManualTransactionAttachmentAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/manual-transactions", router);
