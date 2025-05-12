"use strict";

const Sentry = require("@sentry/node");

function catchError(error) {
  Sentry.captureException(error);
}

module.exports = catchError;
