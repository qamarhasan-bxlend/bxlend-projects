"use strict";

module.exports = {
  ...require("./order"),
  ...require("./settings"),
  ...require("./ticker"),
  ...require("./wallets"),
  ...require('./currency-exchange'),
  ...require('./password-reset'),
  ...require('./transaction'),
  ...require('./vaultody'),
  ...require('./presaleUser')
};
