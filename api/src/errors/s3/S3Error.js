"use strict";

const { STATUS_CODE } = require("@src/constants");
const { STATUS_CODES } = require("http");

class S3Error extends Error {
  /**
   *
   * @param {number=} statusCode
   * @param {string=} message
   * @param {Object=} details
   */
  constructor(statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR, message = STATUS_CODES[statusCode], details = undefined) {
    super(message);

    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = S3Error;
