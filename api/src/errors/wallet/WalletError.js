"use strict";

/* istanbul ignore file */

class WalletError extends Error {

  constructor(message){
    super(message);
  }

}

module.exports = WalletError;
