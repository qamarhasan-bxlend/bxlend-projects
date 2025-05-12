"use strict";

module.exports = {
  ...require("./countries"),
  ...require("./currencies"),
  ...require("./currency-pairs"),
  ...require("./users"),
  ...require("./verifications"),
  ...require("./wallets"),
  ...require("./wallet_addresses"),
  ...require("./orders"),
  ...require("./bank-accounts"),
  ...require("./manual-transactions"),
  ...require("./admin"),
  ...require("./order-book"),
  ...require("./klines"),
  ...require("./kyc"),
  ...require('./transactions'),
  ...require('./notifications'),
  ...require('./deposit_addresses'),
  ...require('./orders-kraken')
};
