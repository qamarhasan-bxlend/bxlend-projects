"use strict";

const { Router } = require("express");
const countries = require("./countries");
const currencies = require("./currencies");
const currencPairs = require("./currency-pairs");
const orders = require("./orders");
const users = require("./users");
const verifications = require("./verifications");
const wallets = require("./wallets");
const walletAddresses = require("./wallet_addresses");
const bankAccounts = require("./bank-accounts");
const manualTransactions = require("./manual-transactions");
const admin = require("./admin");
const orderBook = require("./order-book");
const klines = require("./klines");
const kyc = require("./kyc");
const webhook = require("./webhook");
const transactions = require("./transactions");
const tickers = require('./tickers')
const notifications = require('./notifications')
const marketTrades = require('./market-trades');
const depositAddresses = require('./deposit_addresses');
const ordersKraken = require("./orders-kraken");

const router = Router();

router
  .use(countries)
  .use(currencies)
  .use(currencPairs)
  .use(users)
  .use(verifications)
  .use(wallets)
  .use(walletAddresses)
  .use(orders)
  .use(bankAccounts)
  .use(manualTransactions)
  .use(orderBook)
  .use(klines)
  .use(kyc)
  .use(admin)
  .use(webhook)
  .use(transactions)
  .use(tickers)
  .use(notifications)
  .use(marketTrades)
  .use(depositAddresses)
  .use(ordersKraken)

module.exports = Router().use("/v1", router);
