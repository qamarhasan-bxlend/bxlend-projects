"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/admin/manual-transactions";

it("should list Manual Transactions", async () => {
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
  const manual_deposit_transaction = await factory.manualDepositTransaction(user, wallet, cryptoCurrency, 0, {
    populated: true,
  });

  const { body } = await http()
    .get(endpoint)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    manual_transactions: [serializeDocument(manual_withdraw_transaction), serializeDocument(manual_deposit_transaction)],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 2,
    },
  });

});

it("should list 0 Manual Transactions, if page doesn't exist", async () => {
  const { factory, http } = require("@tests/internals");
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

  await factory.manualWithdrawTransaction(user, wallet, bankAccount, 0, {
    populated: true,
  });
  await factory.manualDepositTransaction(user, wallet, cryptoCurrency, 0, {
    populated: true,
  });

  const { body } = await http()
    .get(endpoint)
    .query({
      page: 2,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    manual_transactions: [],
    meta: {
      page: 2,
      limit: 10,
      page_count: 1,
      total_count: 2,
    },
  });
});

it("should list only limited amount of Manual Transactions", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { orderBy } = require("lodash");

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

  const manual_transactions = await Promise.all([
    factory.manualWithdrawTransaction(user, wallet, bankAccount, 0, {
      populated: true,
    }),
    factory.manualDepositTransaction(user, wallet, cryptoCurrency, 0, {
      populated: true,
    }),
  ]);

  const { body } = await http()
    .get(endpoint)
    .query({
      limit: 1,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    manual_transactions: [serializeDocument(orderBy(manual_transactions, ["id"], ["asc"])[0])],
    meta: {
      page: 1,
      limit: 1,
      page_count: 2,
      total_count: 2,
    },
  });

});

it("should not be able to list all of the Manual Transactions", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(endpoint)
    .query({
      limit: 0,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.BAD_REQUEST);

  expect(body).toEqual({
    error: "bad-request",
    details: {
      limit: [
        "\"limit\" must be greater than or equal to 1",
      ],
    },
  });
});

it("should list Manual Withdraw Transactions only with the selected fields", async () => {
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
  const manual_deposit_transaction = await factory.manualDepositTransaction(user, wallet, cryptoCurrency, 0, {
    populated: true,
  });

  const select = ["id", "to", "quantity", "kind"];

  const { body } = await http()
    .get(endpoint)
    .query({
      select,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    manual_transactions: [serializeDocument(manual_withdraw_transaction, select), serializeDocument(manual_deposit_transaction, select)],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 2,
    },
  });
});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const { body } = await http()
    .get(endpoint)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});
