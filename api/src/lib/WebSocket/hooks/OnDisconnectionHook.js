"use strict";

const Hook = require("./Hook");

/**
 * Will initialize super {@link Hook} class
 * @class
 * @classdesc This Hook will intract with how clients' disconnections are going to be handled.
 * @extends Hook
 */
class OnDisconnectionHook extends Hook {

  constructor() {
    super();
  }

  // eslint-disable-next-line no-unused-vars
  execute(request, response, payload) {
      
  }

}

module.exports = OnDisconnectionHook;
