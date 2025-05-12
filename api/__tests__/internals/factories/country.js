"use strict";

const { Country } = require("@src/models");
const faker = require("faker");

/**
 * Create a new user for unit tests.
 *
 * @param {Object=} country
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function countryFactory(country = {}) {
  return Country.create({
    code: faker.address.countryCode(),
    name: faker.address.country(),
    phone_code: "1",
    language: "en-US",
    ...country,
  });
};
