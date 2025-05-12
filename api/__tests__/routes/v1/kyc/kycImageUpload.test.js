"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/kyc/image-upload";

it("should show kyc status", async () => {
  const { factory, http } = require("@tests/internals");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  await http()
    .post(endpoint)
    .set("Authorization", `Bearer ${ accessToken.jti }`);
});