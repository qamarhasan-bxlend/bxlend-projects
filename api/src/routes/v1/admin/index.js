"use strict";

const { Router } = require("express");
const users = require("./users");
const bankAccounts = require("./bank-accounts");
const bitgoAallets = require("./bitgo-wallets");
const orders = require("./orders");
const settings = require("./settings");
const manualTransactions = require("./manual-transactions");
const kyc = require("./kyc");
const transactions = require('./transactions')
const dashboard = require('./dashboard')
const waitingListUsers = require('./waitiling-list-users')
const wallets = require('./wallets')
const referrals = require('./referrals')

const router = Router();

router
  .use(users)
  .use(bankAccounts)
  .use(bitgoAallets)
  .use(orders)
  .use(settings)
  .use(manualTransactions)
  .use(kyc)
  .use(transactions)
  .use(dashboard)
  .use(waitingListUsers)
  .use(wallets)
  .use(referrals)  

module.exports = Router().use("/admin", router);