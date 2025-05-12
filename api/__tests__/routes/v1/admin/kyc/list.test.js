"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should list kycs", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user] = await Promise.all([
    factory.user(),
    factory.country(),
  ]);

  const accessToken = await factory.accessToken(user);

  let kyc = await factory.kyc((user));

  const { body } = await http()
    .get("/v1/admin/kyc")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  body.kycs = body.kycs.map(kyc => {
    kyc.user = user.id;
    return kyc;
  });

  expect(body).toEqual({
    kycs: [serializeDocument(kyc)],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });
});