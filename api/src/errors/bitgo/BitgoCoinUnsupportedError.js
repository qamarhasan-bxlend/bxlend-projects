"use strict";

/* istanbul ignore file */

const BitgoError = require("./BitgoError");

class BitgoCoinUnsupportedError extends BitgoError {

  constructor(message){
    super(message);
  }

}

module.exports = BitgoCoinUnsupportedError;