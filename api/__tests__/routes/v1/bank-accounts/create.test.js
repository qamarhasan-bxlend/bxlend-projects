"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/bank-accounts";

it("should update a Bank Account information", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, fiatCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  let [accessToken] = await Promise.all([
    factory.accessToken(user),
  ]);

  let creatingData = {
    bank_name: "My Bank",
    bank_country: country._id,
    account_number: "1001001234",
    swift_bic_code: "AAAABBCC123",
    currency: fiatCurrency._id,
  };

  const { body } = await http()
    .post(endpoint)
    .send(creatingData)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  creatingData = {
    ...creatingData,
    status: "UNDER_REVIEW",
    reviews: [],
    owner: user._id.toString(),
  };
  body.bank_account && delete body.bank_account.created_at;
  body.bank_account && delete body.bank_account.updated_at;

  expect(body).toEqual({ bank_account: serializeDocument(creatingData) });

});
