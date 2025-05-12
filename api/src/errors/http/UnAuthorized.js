"use strict";

const { STATUS_CODE, ERROR } = require("@src/constants");
const HTTPError = require("./HTTPError");

class UnAuthorized extends HTTPError {
  /**
   *
   * @param {string=} message
   */
  constructor(message = ERROR.UNAUTHORIZED) {
    super(STATUS_CODE.UNAUTHORIZED, message);
  }
}

module.exports = UnAuthorized;
