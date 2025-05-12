"use strict";

const { PhoneNumberVerification } = require("@src/models");
const faker = require("faker");

/**
 * Create a new phone number verification for unit tests.
 *
 * @param {import("mongoose").Document} user
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function phoneNumberVerificationFactory(user) {
  return PhoneNumberVerification.create({
    user: user._id,
    input: user.phone_number,
    platform_id: faker.datatype.uuid(),
  });
};
