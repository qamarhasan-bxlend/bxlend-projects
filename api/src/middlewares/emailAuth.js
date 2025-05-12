"use strict";

const { ERROR } = require("@src/constants");
const { Forbidden } = require("@src/errors");

/**
 * Authorizes user/admin access to API endpoints.
 *
 * @returns {function(*, *, *)} - The Authorization middleware for Email verification.
 */
function emailAuth() {

  return async function emailAuth(req, res, next) {
    
    console.log(req.user.email_verified_at)
    if (req.user.email_verified_at == null ) throw new Forbidden(ERROR.EMAIL_NOT_VERIFIED);
    next();
  };
}

module.exports = emailAuth;
