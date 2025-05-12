"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/bank-accounts";

it("should update a Bank Account information", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { BankAccount } = require("@src/models");
  const { omit } = require("lodash");
  const faker = require("faker");

  const [user, fiatCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  let [accessToken, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.bankAccount(user, country, fiatCurrency, {
      populated: true,
    }),
  ]);

  const changingProperty = "bank_name";
  const changingValue = faker.company.companyName();

  bankAccount = JSON.parse(JSON.stringify(bankAccount));

  bankAccount[changingProperty] = changingValue;
  bankAccount = omit(bankAccount, ["updated_at", "created_at"]);

  await http()
    .patch(`${ endpoint }/${ bankAccount.id }`)
    .send({
      [changingProperty]: changingValue,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  const bank_accounts = await BankAccount.find({})
    .populate("owner", "-created_at -updated_at -password")
    .populate("reviews.reviewer", "-created_at -updated_at -password")
    .populate("bank_country", "-created_at -updated_at -password");

  const bank_account = omit(JSON.parse(JSON.stringify(bank_accounts[0])), ["updated_at", "created_at"]);

  expect(bank_account).toEqual(bankAccount);

});
