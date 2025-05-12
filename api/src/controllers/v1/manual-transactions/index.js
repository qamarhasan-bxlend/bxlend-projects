"use strict";

//Withdraw & Deposit
module.exports = {
  ...require("./deposit"),
  ...require("./withdraw"),
};


//General
module.exports.listManualTransactionsV1 = require("./list");
module.exports.showManualTransactionV1 = require("./show");
module.exports.showManualTransactionAttachmentV1 = require("./attachment");
