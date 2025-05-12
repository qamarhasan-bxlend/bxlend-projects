"use strict";

const ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
};

const RELEASE = {
  PRODUCTION: "production",
  STAGING: "staging",
};

const BRAND = "BxLend"; // TODO: maybe database?
const BUSINESS_ADDRESS = "B10, 11 floor Tai Cheung Factory Building 3 Wing Ming Street Hong Kong"; // TODO: maybe database?

module.exports = {
  ENV,
  RELEASE,
  BRAND,
  BUSINESS_ADDRESS,
};
