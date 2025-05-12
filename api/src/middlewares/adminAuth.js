"use strict";

const { ERROR } = require("@src/constants");
const { Forbidden } = require("@src/errors");

/**
 * Authorizes user/admin access to API endpoints.
 *
 * @returns {function(*, *, *)} - The Authorization middleware for Admin ROutes.
 */
function adminAuth() {
  return async function adminAuth(req, res, next) {
    if (!req.user?.isAdmin) throw new Forbidden();
    next();
  };
}

module.exports = adminAuth;
