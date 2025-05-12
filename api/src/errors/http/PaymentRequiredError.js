"use strict";

const { STATUS_CODE, ERROR } = require("@src/constants");
const HTTPError = require("./HTTPError");

class PaymentRequiredError extends HTTPError {
  /**
   *
   * @param {string=} message
   */
  constructor(message = ERROR.PAYMENT_REQUIRED) {
    super(STATUS_CODE.PAYMENT_REQUIRED, message);
  }
}

module.exports = PaymentRequiredError;
