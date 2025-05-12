"use strict";

/* istanbul ignore file */

const BitgoError = require("./BitgoError");

class BitgoNotfoundError extends BitgoError {

  constructor(message){
    super(message);
  }

}

module.exports = BitgoNotfoundError;