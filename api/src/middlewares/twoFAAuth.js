"use strict";

const { ERROR } = require("@src/constants");
const { Forbidden } = require("@src/errors");

/**
 * Authorizes user/admin access to API endpoints.
 *
 * @returns {function(*, *, *)} - The Authorization middleware for Two Factor Authentication.
 */
function twoFAAuth() {
  return async function twoFAAuth(req, res, next) {
    if (!req.user.twoFA_verified) throw new Forbidden(ERROR.COMPLETE_TWO_FACTOR_AUTHENTICATION_FIRST);
    next();
  };
}

module.exports = twoFAAuth;
