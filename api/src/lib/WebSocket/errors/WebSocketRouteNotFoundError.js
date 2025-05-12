"use strict";

const WebSocketError = require("./WebSocketError");

/**
 * Will initialize super {@link WebSocketError} class
 * @class
 * @classdesc This Error will thrown when a parsing error occur.
 * @extends WebSocketError
 */
class WebSocketRouteNotFoundError extends WebSocketError {}

module.exports = WebSocketRouteNotFoundError;