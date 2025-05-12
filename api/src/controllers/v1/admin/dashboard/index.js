"use strict";

module.exports = {
  ...require("./bank-accounts"),
  //   ...require("./bitgo-wallets"),
  //   ...require("./manual-transactions"),
  ...require("./orders"),
  //   ...require("./settings"),
  ...require("./users"),
    ...require("./kyc"),
  ...require("./transactions"),
};
