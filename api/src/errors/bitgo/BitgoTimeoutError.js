"use strict";

/* istanbul ignore file */

const BitgoError = require("./BitgoError");

class BitgoTimeoutError extends BitgoError {

  constructor(message){
    super(message);
  }

}

module.exports = BitgoTimeoutError;