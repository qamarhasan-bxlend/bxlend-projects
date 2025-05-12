"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/kyc/create-request";

it("should create kyc request", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, country] = await Promise.all([
    factory.user(),
    factory.country(),
  ]);

  let [accessToken] = await Promise.all([
    factory.accessToken(user),
  ]);

  let creatingData = {
    "name": {
      "first": user.name.first,
      "last": user.name.last,
    },
    "country_code": country.code,
    "identification_type": "PASSPORT",
    "identification_url": {
      "front": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv7p864jgKRqUvMFo51wi9enU8ZHu_08ZR6w&usqp=CAU",
      "back": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv7p864jgKRqUvMFo51wi9enU8ZHu_08ZR6w&usqp=CAU",
    },
    "photo_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv7p864jgKRqUvMFo51wi9enU8ZHu_08ZR6w&usqp=CAU",
    "terms_and_conditions_consent": true,
    "privacy_policy_consent": true,
  };

  await http()
    .post(endpoint)
    .send(creatingData)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);
});
