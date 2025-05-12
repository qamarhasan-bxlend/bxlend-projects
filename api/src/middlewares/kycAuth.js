"use strict";

const { KYC_STATUS, ERROR} = require("@src/constants");
const { Forbidden } = require("@src/errors");

/**
 * Authorizes user/admin access to API endpoints.
 *
 * @returns {function(*, *, *)} - The Authorization middleware for kyc verification.
 */
function kycAuth() {
  return async function kycAuth(req, res, next) {
    if (req.user.kyc_status != KYC_STATUS.VERIFIED)  throw new Forbidden(ERROR.KYC_NOT_VERIFIED);
    next();
  };
}

module.exports = kycAuth;
