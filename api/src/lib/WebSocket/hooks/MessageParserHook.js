"use strict";

const OnMessageHook = require("./OnMessageHook");
const { WebSocketMessageParsingError } = require("../errors");

/**
 * Will initialize super {@link Hook} class
 * @class
 * @classdesc This Hook will parse the incomming and outgoing messages.
 * @extends Hook
 */
class MessageParserHook extends OnMessageHook {

  constructor() {
    super();
  }

  // eslint-disable-next-line no-unused-vars
  execute(request, response, payload) {

    try {

      request.message = JSON.parse(request.message);

    } catch (error) {

      console.log(error);
      throw new WebSocketMessageParsingError;

    }

  }

}

module.exports = MessageParserHook;
