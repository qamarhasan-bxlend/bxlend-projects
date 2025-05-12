"use strict";

const Hook = require("./Hook");

/**
 * Will initialize super {@link Hook} class
 * @class
 * @classdesc This Hook will validates the incomming messages.
 * @extends Hook
 */
class ValidatorHook extends Hook {

  constructor() {
    super();
  }

  // eslint-disable-next-line no-unused-vars
  execute(request, response, headers){

  }

}

module.exports = ValidatorHook;