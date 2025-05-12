"use strict";

/* istanbul ignore file */

const WalletError = require("./WalletError");

class WalletCurrencyUnsupported extends WalletError {

  constructor(message){
    super(message);
  }

}

module.exports = WalletCurrencyUnsupported;