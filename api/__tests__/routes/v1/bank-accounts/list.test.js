"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/bank-accounts";

it("should list Bank Accounts", async () => {
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
    .get(endpoint)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    bank_accounts: [serializeDocument(bankAccount)],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });

});

it("should list 0 Bank Accounts, if page doesn't exist", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, fiatCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [accessToken] = await Promise.all([
    factory.accessToken(user),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  const { body } = await http()
    .get(endpoint)
    .query({
      page: 2,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    bank_accounts: [],
    meta: {
      page: 2,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });
});

it("should list only limited amount of Bank Accounts", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { orderBy } = require("lodash");

  const [user, fiatCurrency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [accessToken, ...bankAccounts] = await Promise.all([
    factory.accessToken(user),
    factory.bankAccount(user, country, fiatCurrency),
    factory.bankAccount(user, country, fiatCurrency),
  ]);

  const { body } = await http()
    .get(endpoint)
    .query({
      limit: 1,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    bank_accounts: [serializeDocument(orderBy(bankAccounts, ["id"], ["asc"])[0])],
    meta: {
      page: 1,
      limit: 1,
      page_count: 2,
      total_count: 2,
    },
  });

});

it("should not be able to list all of the Bank Accounts", async () => {
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

it("should list Bank Accounts only with the selected fields", async () => {
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

  const select = ["id", "bank_name", "account_number"];

  const { body } = await http()
    .get(endpoint)
    .query({
      select,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    bank_accounts: [serializeDocument(bankAccount, select)],
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
