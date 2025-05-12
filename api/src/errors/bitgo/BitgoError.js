"use strict";

/* istanbul ignore file */

class BitgoError extends Error {

  constructor(message){
    super(message);
  }

}

module.exports = BitgoError;
