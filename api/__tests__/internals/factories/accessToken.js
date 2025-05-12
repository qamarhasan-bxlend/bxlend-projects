"use strict";

const { WEBSITE_CLIENT_ID, WEBSITE_CLIENT_REDIRECT_URI, API_URI } = require("@src/config");
const { TOKEN_GTY, TOKEN_KIND, AUTH_SCOPE } = require("@src/constants");
const { Token } = require("@src/models");
const faker = require("faker");
const moment = require("moment");

/**
 * Create a new user for unit tests.
 *
 * @param {import("mongoose").Document} user
 * @param {string[]} scopes
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function accessTokenFactory(user, scopes = [AUTH_SCOPE.READ_USER_PROFILE]) {
  const now = new Date();

  return Token.create({
    scopes,
    resources: [API_URI],
    amr: [],
    policies: [],
    jti: faker.datatype.uuid(),
    account_id: user._id.toString(),
    client_id: WEBSITE_CLIENT_ID,
    expires_at: moment(now).add(1, "hour").toDate(),
    expires_with_session: true,
    grant_id: faker.datatype.uuid(),
    gty: TOKEN_GTY.AUTHORIZATION_CODE,
    issued_at: now,
    kind: TOKEN_KIND.ACCESS_TOKEN,
    nonce: faker.datatype.uuid(),
    redirect_uri: WEBSITE_CLIENT_REDIRECT_URI,
    session_uid: faker.datatype.uuid(),
  });
};
