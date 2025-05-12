"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/bank-accounts";

it("should fetch Bank Account by id", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, fiatCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [accessToken, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  const { body } = await http()
    .get(`${ endpoint }/${ bankAccount._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ bank_account: serializeDocument(bankAccount) });

});

it("should respond with 404 in case of wrong id", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");
  const {
    Types: { ObjectId },
  } = require("mongoose");

  const [user, fiatCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [accessToken, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  //Creating a wrong transaction id
  let wrong_bank_account_id = new ObjectId();
  while (wrong_bank_account_id.equals(bankAccount._id)) wrong_bank_account_id = new ObjectId();

  const { body } = await http()
    .get(`${ endpoint }/${ wrong_bank_account_id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: ERROR.BANK_ACCOUNT_NOT_FOUND });

});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, fiatCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  const { body } = await http()
    .get(`${ endpoint }/${ bankAccount._id }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});

it("should respond with 401 in case of wrong access token", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, fiatCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  const { body } = await http()
    .get(`${ endpoint }/${ bankAccount._id }`)
    .set("Authorization", "Bearer some-wrong-value")
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});

it("should respond with 401 in case of deactivated user", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, fiatCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [accessToken, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  user.deleted_at = new Date();

  await user.save();

  const { body } = await http()
    .get(`${ endpoint }/${ bankAccount._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});
