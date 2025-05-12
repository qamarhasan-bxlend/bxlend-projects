"use strict";

const { USER_GENDER } = require("@src/constants");
const { User } = require("@src/models");
const bcrypt = require("bcrypt");
const faker = require("faker");

/**
 * Create a new user for unit tests.
 *
 * @param {Object=} user
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function userFactory(user = {}) {
  const password = await bcrypt.hash(user.password ?? faker.internet.password(), 10);

  return User.create({
    email: faker.internet.email(),
    email_verified_at: new Date(),
    name: {
      first: faker.name.firstName(),
      last: faker.name.lastName(),
    },
    birthdate: faker.date.past(),
    gender: USER_GENDER.MALE,
    phone_number: "+12133734253",
    phone_number_verified_at: new Date(),
    ...user,
    password,
  });
};
