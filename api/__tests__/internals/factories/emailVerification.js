"use strict";

const { EmailVerification } = require("@src/models");
const faker = require("faker");

/**
 * Create a new email verification for unit tests.
 *
 * @param {import("mongoose").Document} user
 * @param {Object=} verification
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function emailVerificationFactory(user, verification = {}) {
  return EmailVerification.create({
    token: faker.datatype.uuid(),
    ...verification,
    user: user._id,
    input: user.email,
    platform_id: faker.datatype.uuid(),
  });
};
