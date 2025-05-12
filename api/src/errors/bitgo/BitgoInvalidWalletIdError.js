"use strict";

/* istanbul ignore file */

const BitgoError = require("./BitgoError");

class BitgoInvalidWalletIdError extends BitgoError {

  constructor(message){
    super(message);
  }

}

module.exports = BitgoInvalidWalletIdError;