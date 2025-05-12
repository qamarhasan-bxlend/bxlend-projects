"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/admin/manual-transactions";

it("should fetch Manual Withdraw and Deposit Transaction by id", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, fiatCurrency, cryptoCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.cryptoCurrency(),
    factory.country(),
  ]);

  const [accessToken, wallet, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.cryptoWallet(user, cryptoCurrency),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  const manual_withdraw_transaction = await factory.manualWithdrawTransaction(user, wallet, bankAccount, 0, {
    populated: true,
  });
  const manual_deposit_transaction = await factory.manualDepositTransaction(user, wallet, cryptoCurrency, bankAccount, {
    populated: true,
  });

  const request_deposit_transaction = await http()
    .get(`${ endpoint }/${ manual_deposit_transaction._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(request_deposit_transaction.body).toEqual({ manual_transaction: serializeDocument(manual_deposit_transaction) });

  const request_withdraw_transaction = await http()
    .get(`${ endpoint }/${ manual_withdraw_transaction._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(request_withdraw_transaction.body).toEqual({ manual_transaction: serializeDocument(manual_withdraw_transaction) });

});

it("should respond with 404 in case of wrong id", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");
  const { Types: { ObjectId } } = require("mongoose");

  const [user, fiatCurrency, cryptoCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.cryptoCurrency(),
    factory.country(),
  ]);

  const [accessToken, wallet, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.cryptoWallet(user, cryptoCurrency),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  const manual_withdraw_transaction = await factory.manualWithdrawTransaction(user, wallet, bankAccount, 0, {
    populated: true,
  });
  const manual_deposit_transaction = await factory.manualDepositTransaction(user, wallet, cryptoCurrency, 0, {
    populated: true,
  });

  //Creating a wrong transaction id
  let wrong_transaction_id = new ObjectId();
  while (wrong_transaction_id.equals(manual_withdraw_transaction._id) || wrong_transaction_id.equals(manual_deposit_transaction._id)) wrong_transaction_id = new ObjectId();

  const { body } = await http()
    .get(`${ endpoint }/${ wrong_transaction_id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: ERROR.MANUAL_TRANSACTION_NOT_FOUND });

});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, fiatCurrency, cryptoCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.cryptoCurrency(),
    factory.country(),
  ]);

  const [wallet, bankAccount] = await Promise.all([
    factory.cryptoWallet(user, cryptoCurrency),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  const manual_withdraw_transaction = await factory.manualWithdrawTransaction(user, wallet, bankAccount, 0, {
    populated: true,
  });

  const { body } = await http()
    .get(`${ endpoint }/${ manual_withdraw_transaction._id }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });

});

it("should respond with 401 in case of wrong access token", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, fiatCurrency, cryptoCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.cryptoCurrency(),
    factory.country(),
  ]);

  const [wallet, bankAccount] = await Promise.all([
    factory.cryptoWallet(user, cryptoCurrency),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  const manual_withdraw_transaction = await factory.manualWithdrawTransaction(user, wallet, bankAccount, 0, {
    populated: true,
  });

  const { body } = await http()
    .get(`${ endpoint }/${ manual_withdraw_transaction._id }`)
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

  const manual_transaction = await factory.manualWithdrawTransaction(user, wallet, bankAccount, 0, {
    populated: true,
  });

  user.deleted_at = new Date();

  await user.save();

  const { body } = await http()
    .get(`${ endpoint }/${ manual_transaction._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});
