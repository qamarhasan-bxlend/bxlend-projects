"use strict";

const { Router } = require("express");
const users = require("./users");
const bankAccounts = require("./bank-accounts");
const currency_pairs = require('./currency-pairs')
const orders = require("./orders");
const kyc = require("./kyc");
const transactions = require('./transactions')
// const settings = require("./settings");
// const manualTransactions = require("./manual-transactions");
// const bitgoWallets = require("./bitgo-wallets");

const router = Router();

router
  .use(users)
  .use(bankAccounts)
  .use(orders)
  .use(currency_pairs)
  .use(kyc)
  .use(transactions);
  //   .use(bitgoWallets)
  //   .use(settings)
  //   .use(manualTransactions)


module.exports = Router().use("/dashboard", router);