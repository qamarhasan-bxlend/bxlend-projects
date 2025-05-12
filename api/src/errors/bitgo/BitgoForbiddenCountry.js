"use strict";

/* istanbul ignore file */

const BitgoError = require("./BitgoError");

class BitgoForbiddenCountry extends BitgoError {

  constructor(message){
    super(message);
  }

}

module.exports = BitgoForbiddenCountry;