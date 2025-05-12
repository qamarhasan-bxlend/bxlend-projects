"use strict";

const {
  WebSocket: {
    Hooks: { OnConnectionHook },
  },
} = require("@src/lib");

class EventHandlerHook extends OnConnectionHook {

  constructor() {
    super();
  }

  execute(request, response, { eventEmitter }){
    request.once = (event, callback) => eventEmitter.on(event, callback);
  }

}

module.exports = EventHandlerHook;
