"use strict";

/* istanbul ignore file */

const BitgoNotfoundError = require("./BitgoNotfoundError");

class BitgoWalletNotfoundError extends BitgoNotfoundError {

  constructor(message){
    super(message);
  }

}

module.exports = BitgoWalletNotfoundError;