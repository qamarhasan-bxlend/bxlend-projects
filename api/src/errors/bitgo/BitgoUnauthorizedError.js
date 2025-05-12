"use strict";

/* istanbul ignore file */

const BitgoError = require("./BitgoError");

class BitgoUnauthorizedError extends BitgoError {

  constructor(message){
    super(message);
  }

}

module.exports = BitgoUnauthorizedError;