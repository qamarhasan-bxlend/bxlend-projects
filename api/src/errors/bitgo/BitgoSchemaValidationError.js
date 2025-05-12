"use strict";

/* istanbul ignore file */

const BitgoError = require("./BitgoError");

class BitgoSchemaValidationError extends BitgoError {

  constructor(message){
    super(message);
  }

}

module.exports = BitgoSchemaValidationError;