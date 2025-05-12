"use strict";

const {
  WebSocket: {
    Hooks: { ValidatorHook },
  },
} = require("@src/lib");

class AuthorizationHook extends ValidatorHook {
  constructor() {
    super();
  }

  execute(request, response, payload){
    const token = request.headers['authorization'];
  }
}

module.exports = AuthorizationHook;
