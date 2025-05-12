"use strict";

const {
  WebSocket: {
    Hooks: { OnDisconnectionHook },
  },
} = require("@src/lib");

class OnCloseEventEmitterHook extends OnDisconnectionHook {

  constructor({event}) {
    super();
    this.event = event;
  }

  execute(request, response, { eventEmitter }){
    eventEmitter.emit(this.event);
  }

}

module.exports = OnCloseEventEmitterHook;
