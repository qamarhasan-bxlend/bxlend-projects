"use strict";

const { NODE_ENV } = require("@src/config");
const { ENV, ERROR, STATUS_CODE } = require("@src/constants");
const { STATUS_CODES } = require("http");

class HTTPError extends Error {
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

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
  handle(req, res) {
    const { message, details, statusCode } = this;

    const json = {
      error: message,
    };

    /* istanbul ignore next */
    if (NODE_ENV === ENV.PRODUCTION && statusCode === STATUS_CODE.INTERNAL_SERVER_ERROR) {
      json.error = ERROR.INTERNAL_SERVER_ERROR;
    } else if (details != null) {
      json.details = details;
    }

    res
      .status(statusCode)
      .json(json);
  }
}

module.exports = HTTPError;
