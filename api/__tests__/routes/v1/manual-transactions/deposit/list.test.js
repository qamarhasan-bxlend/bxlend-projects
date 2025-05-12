"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/manual-transactions/deposit";

it("should list Manual Deposit Transactions", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const wallet = await factory.cryptoWallet(user, currency);
  const manual_transaction = await factory.manualDepositTransaction(user, wallet, currency, 3);
  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(endpoint)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    manual_transactions: [serializeDocument(manual_transaction)],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });

});

it("should list 0 Manual Deposit Transactions, if page doesn't exist", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const wallet = await factory.cryptoWallet(user, currency);
  await factory.manualDepositTransaction(user, wallet, currency, 3);
  const accessToken = await factory.accessToken(user);

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
      total_count: 1,
    },
  });
});

it("should list only limited amount of Manual Deposit Transactions", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { orderBy } = require("lodash");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const wallet = await factory.cryptoWallet(user, currency);
  const manual_transactions = await Promise.all([
    factory.manualDepositTransaction(user, wallet, currency, 3),
    factory.manualDepositTransaction(user, wallet, currency, 3),
  ]);
  const accessToken = await factory.accessToken(user);

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

it("should not be able to list all of the Manual Deposit Transactions", async () => {
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

it("should list Manual Deposit Transactions only with the selected fields", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const wallet = await factory.cryptoWallet(user, currency);
  const manual_transaction = await factory.manualDepositTransaction(user, wallet, currency, 3);
  const accessToken = await factory.accessToken(user);

  const select = ["id", "to", "quantity", "kind"];

  const { body } = await http()
    .get(endpoint)
    .query({
      select,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    manual_transactions: [serializeDocument(manual_transaction, select)],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 1,
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
