"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/admin/kyc/";

it("should fetch kyc by id", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();

  const [accessToken, kyc] = await Promise.all([
    factory.accessToken(user),
    factory.kyc((user)),
  ]);

  const { body } = await http()
    .get(`${ endpoint }/${ kyc._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ kyc: serializeDocument(kyc) });

});