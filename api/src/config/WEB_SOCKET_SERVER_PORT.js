"use strict";

const assert = require("assert");

const WEB_SOCKET_SERVER_PORT = +(process.env.WEB_SOCKET_SERVER_PORT || 3001);

assert(
  !Number.isNaN(WEB_SOCKET_SERVER_PORT),
  "Expected <WEB_SOCKET_SERVER_PORT> to be a valid number",
);

assert(
  Number.isInteger(WEB_SOCKET_SERVER_PORT),
  "Expected <WEB_SOCKET_SERVER_PORT> to be a valid integer",
);

assert(
  WEB_SOCKET_SERVER_PORT <= 65535 && WEB_SOCKET_SERVER_PORT >= 1 ,
  "Expected <WEB_SOCKET_SERVER_PORT> to be a valid parsed number between 1 and 65535",
);

module.exports = parseInt(WEB_SOCKET_SERVER_PORT);
