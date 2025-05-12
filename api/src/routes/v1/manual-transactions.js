"use strict";

const {
  showManualTransactionV1,
  listManualTransactionsV1,
  showManualTransactionAttachmentV1,

  showManualDepositTransactionsV1,
  listManualDepositTransactionsV1,
  createManualDepositTransactionsV1,
  updateManualDepositTransactionsV1,

  showManualWithdrawTransactionsV1,
  listManualWithdrawTransactionsV1,
  createManualWithdrawTransactionsV1,
  updateManualWithdrawTransactionsV1,
} = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();


// ------------------------- Deposit -------------------------

router.route("/deposit").get(wrapController(listManualDepositTransactionsV1));

router.route("/deposit/:manual_transaction_id").get(wrapController(showManualDepositTransactionsV1));

router.route("/deposit").post(wrapController(createManualDepositTransactionsV1));

router.route("/deposit/:manual_transaction_id").patch(wrapController(updateManualDepositTransactionsV1));

// ------------------------- Withdraw ------------------------

router.route("/withdraw").get(wrapController(listManualWithdrawTransactionsV1));

router.route("/withdraw/:manual_transaction_id").get(wrapController(showManualWithdrawTransactionsV1));

router.route("/withdraw").post(wrapController(createManualWithdrawTransactionsV1));

router.route("/withdraw/:manual_transaction_id").patch(wrapController(updateManualWithdrawTransactionsV1));

// ------------------------- General -------------------------

router.route("/").get(wrapController(listManualTransactionsV1));

router.route("/:manual_transaction_id").get(wrapController(showManualTransactionV1));

router.route("/:manual_transaction_id/attachment/:attachment_id").get(wrapController(showManualTransactionAttachmentV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/manual-transactions", router);
