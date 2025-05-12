"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/bank-accounts";

it("should remove the Bank Account by id", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { BankAccount } = require("@src/models");
  const { omit } = require("lodash");

  const [user, fiatCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  let [accessToken, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  bankAccount = JSON.parse(JSON.stringify(bankAccount));
  bankAccount = omit(bankAccount, ["updated_at"]);

  const { body } = await http()
    .delete(`${ endpoint }/${ bankAccount.id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  delete body.bank_account.updated_at;

  expect(body).toEqual({ bank_account: serializeDocument(bankAccount) });

  const bank_accounts = await BankAccount.find({})
    .populate("owner", "-created_at -updated_at -password")
    .populate("reviews.reviewer", "-created_at -updated_at -password")
    .populate("bank_country", "-created_at -updated_at -password");

  const bank_account = bank_accounts[0];

  expect(bank_account.deleted_at).toBeTruthy();

});
