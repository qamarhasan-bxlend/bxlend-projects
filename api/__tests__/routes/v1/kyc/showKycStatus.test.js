"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/kyc/status";

it("should show kyc status", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();

  const [accessToken, kyc] = await Promise.all([
    factory.accessToken(user),
    factory.kyc((user)),
  ]);

  const { body } = await http()
    .get(`${ endpoint }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);
  
  expect(body).toEqual({ kyc: { status: kyc.status, _id: kyc.id, __v: 0 } });
});