"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/admin/kyc";

it("should update a kyc status", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, KYC_STATUS } = require("@src/constants");

  const user = await factory.user();
  const accessToken = await factory.accessToken(user);

  let kyc = await factory.kyc(user);

  const changingProperty = "status";
  const changingValue = KYC_STATUS.VERIFIED;

  kyc[changingProperty] = changingValue;

  await http()
    .patch(`${ endpoint }/${ kyc._id }`)
    .send({
      [changingProperty]: changingValue,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);
});
