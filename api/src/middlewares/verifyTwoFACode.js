"use strict";

const { ERROR } = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { authenticator } = require('otplib')
const { User } = require('@src/models')

/**
 * Authorizes user/admin access to API endpoints.
 *
 * @returns {function(*, *, *)} - The Authorization middleware for verifying two fa code.
 */
function verifyTwoFACode() {
    return async function verifyTwoFACode(req, res, next) {
        const user = await User.findById(req.user.id)

        if (!authenticator.check(req.body.two_fa_code, user.secret)) {
            throw new Forbidden(ERROR.INVALID_TWO_FA_CODE);
        }
        next();
    };
}

module.exports = verifyTwoFACode;
