"use strict";

const OnConnectionHook = require("./OnConnectionHook");

/**
 * Will initialize super {@link Hook} class
 * @class
 * @classdesc This Hook will validates the incomming messages.
 * @extends Hook
 */
class RouterHook extends OnConnectionHook {
  
  constructor() {
    super();
  }

  // eslint-disable-next-line no-unused-vars
  execute(request, response, payload) {

    request.handler = payload.routes[request.path];
    console.log(request)

    if (request.handler){
      request.handler(request, response);
    }else{
      // TODO: handle wrong path
    }

  }

}

module.exports = RouterHook;
