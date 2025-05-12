"use strict";

const { STATUS_CODE, ERROR } = require("@src/constants");
const HTTPError = require("./HTTPError");

class Forbidden extends HTTPError {
  /**
   *
   * @param {string=} message
   */
  constructor(message = ERROR.FORBIDDEN) {
    super(STATUS_CODE.FORBIDDEN, message);
  }
}

module.exports = Forbidden;
