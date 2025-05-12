"use strict";

const Hook = require("./Hook");

/**
 * Will initialize super {@link Hook} class
 * @class
 * @classdesc This Hook will intract with how incomming connections are going to be manipulated.
 * @extends Hook
 */
class OnMessageHook extends Hook {

  constructor() {
    super();
  }

  // eslint-disable-next-line no-unused-vars
  execute(request, response, payload) {
      
  }

}

module.exports = OnMessageHook;