"use strict";

const { ERROR } = require("@src/constants");
const { UnAuthorized, Forbidden } = require("@src/errors");
const { Token, User } = require("@src/models");

/**
 * Authorizes user/client access to API endpoints.
 *
 * @param {(boolean|string[])=} required - Indicates if it should authorize the access; If `string[]` is passed it will
 * be considered as `scopes` parameter with `required = true`.
 * @param {string[]=} scopes - Indicates which access scopes are required to be permitted.
 * @returns {function(*, *, *)} - The Authorization middleware.
 */
function auth(required = true, scopes = []) {
  if (Array.isArray(required)) {
    scopes = required;
    required = true;
  }

  return async function authMiddleware(req, res, next) {
    const AUTHORIZATION = req.get("authorization");

    if (!AUTHORIZATION) {
      if (required) throw new UnAuthorized(ERROR.ACCESS_TOKEN_MISSING);

      /**
       * Checks whether the token has specified scopes.
       * It will return true if no scopes are passed.
       *
       * @param {string} scopes
       * @returns {boolean}
       */
      // eslint-disable-next-line no-unused-vars
      req.can = function can(...scopes) {
        return false;
      };

      return next();
    }

    const accessToken = AUTHORIZATION.replace(/^Bearer /, "");

    const token = await Token.findOne({
      jti: accessToken,
      expires_at: {
        $gt: new Date(),
      },
      consumed_at: { $exists: false },
    });

    if (token == null) throw new UnAuthorized();

    for (const scope of scopes) {
      if (!token.scopes.includes(scope)) throw new Forbidden();
    }

    req.token = token;

    const user = await User.findOne({
      _id: token.account_id,
      deleted_at: { $exists: false },
    });

    if (user == null) throw new UnAuthorized();

    req.user = user;

    if (req.params.user === "me") req.params.user = user;

    /**
     * Checks whether the token has specified scopes.
     * It will return true if no scopes are passed.
     *
     * @param {string} scopes
     * @returns {boolean}
     */
    req.can = function can(...scopes) {
      return Token.can(token, scopes);
    };

    next();
  };
}

module.exports = auth;
