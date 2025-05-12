"use strict";

const { URL } = require("url");
const qs = require("qs");
const { sendMessage, broadcastMessage } = require("./messaging");

function connectionParser(socket, request, client, message){

  const { pathname, search } = new URL(`${request.headers.origin}${request.url}`);

  return {
    req: {
      path: pathname,
      query: qs.parse(search.substring(1)),
      message: message?message:undefined,
      headers: request.headers,
    },
    res: {
      send: (message) => sendMessage(socket, message),
      broadcast: (message) => broadcastMessage(socket, message),
    },
  };

}

module.exports = {
  connectionParser,
};
