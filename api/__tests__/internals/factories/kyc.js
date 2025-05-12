"use strict";

const { Kyc } = require("@src/models");
const { KYC_IDENTIFICATION_TYPE } = require("@src/constants");
const faker = require("faker");

/**
 * Create a new kyc for unit tests.
 *
 * @param {Object=} user
 * @param {Object=} kyc
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function kycFactory(user) {
  return Kyc.create({
    user: user._id,
    email: user.email,
    name: {
      first: user.name.first,
      last: user.name.last,
    },
    country_code: faker.address.countryCode(),
    identification_type: KYC_IDENTIFICATION_TYPE.DRIVING_LICENSE,
    identification_url: {
      front: faker.internet.url(),
      back: faker.internet.url(),
    },
    photo_url: faker.internet.url(),
    terms_and_conditions_consent: true,
    privacy_policy_consent: true,
  });
};
