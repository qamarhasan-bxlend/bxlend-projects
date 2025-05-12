"use strict";

const { STATUS_CODE, ERROR } = require("@src/constants");
const HTTPError = require("./HTTPError");

class NotFound extends HTTPError {
  /**
   *
   * @param {string=} message
   */
  constructor(message = ERROR.NOT_FOUND) {
    super(STATUS_CODE.NOT_FOUND, message);
  }
}

module.exports = NotFound;
