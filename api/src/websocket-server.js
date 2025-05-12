"use strict";

const { AuthorizationHook } = require("@src/hooks");
const { EventHandlerHook, OnCloseEventEmitterHook } = require("@src/hooks");
const routes = require("@src/routes/websocket");
const {
  WebSocket: { Server },
} = require("@src/lib");
const { WEB_SOCKET_SERVER_PORT } = require("@src/config");
const {get_websocket} = require('@src/lib/Scrypt')
// ------------------------- Web Socket Initializations -----------------

const server = new Server({
  port: WEB_SOCKET_SERVER_PORT,
});

// ------------------------- Web Socket Hooks Settings ------------------

server
  .use(AuthorizationHook) // TODO: fix.
  .useFirst(EventHandlerHook)
  .use(OnCloseEventEmitterHook, { event: "closed" })
  .use(routes);

const scrypt_ws = "get_websocket()"
module.exports = {webSocketServer:server, scrypt_webSocket: scrypt_ws};
