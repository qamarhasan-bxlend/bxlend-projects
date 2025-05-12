"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/manual-transactions/withdraw";

it("should fetch Manual Withdraw Transaction by id", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, currency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [accessToken, wallet, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.cryptoWallet(user, currency),
    factory.bankAccount(user, country, currency),
  ]);

  const manual_transaction = await factory.manualWithdrawTransaction(user, wallet, bankAccount);

  const { body } = await http()
    .get(`${ endpoint }/${ manual_transaction._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ manual_transaction: serializeDocument(manual_transaction) });

});

it("should respond with 404 in case of wrong id", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");
  const { Types: { ObjectId } } = require("mongoose");

  const [user, currency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [accessToken, wallet, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.cryptoWallet(user, currency),
    factory.bankAccount(user, country, currency),
  ]);

  const manual_transaction = await factory.manualWithdrawTransaction(user, wallet, bankAccount);

  //Creating a wrong transaction id
  let wrong_transaction_id = new ObjectId();
  while (wrong_transaction_id.equals(manual_transaction._id)) wrong_transaction_id = new ObjectId();

  const { body } = await http()
    .get(`${ endpoint }/${ wrong_transaction_id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: ERROR.MANUAL_TRANSACTION_NOT_FOUND });

});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, currency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [wallet, bankAccount] = await Promise.all([
    factory.cryptoWallet(user, currency),
    factory.bankAccount(user, country, currency),
  ]);

  const manual_transaction = await factory.manualWithdrawTransaction(user, wallet, bankAccount);

  const { body } = await http()
    .get(`${ endpoint }/${ manual_transaction._id }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});

it("should respond with 401 in case of wrong access token", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, currency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [wallet, bankAccount] = await Promise.all([
    factory.cryptoWallet(user, currency),
    factory.bankAccount(user, country, currency),
  ]);

  const manual_transaction = await factory.manualWithdrawTransaction(user, wallet, bankAccount);

  const { body } = await http()
    .get(`${ endpoint }/${ manual_transaction._id }`)
    .set("Authorization", "Bearer some-wrong-value")
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});

it("should respond with 401 in case of deactivated user", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, currency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [accessToken, wallet, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.cryptoWallet(user, currency),
    factory.bankAccount(user, country, currency),
  ]);

  const manual_transaction = await factory.manualWithdrawTransaction(user, wallet, bankAccount);

  user.deleted_at = new Date();

  await user.save();

  const { body } = await http()
    .get(`${ endpoint }/${ manual_transaction._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});
