"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should list wallets", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, currency1, currency2] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);
  const wallet = await factory.cryptoWallet(user, currency1);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/wallets")
    .auth(accessToken.jti, { type: "bearer" })
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    wallets: serializeDocument([
      {
        kind: wallet.kind,
        owner_type: wallet.owner_type,
        owner: wallet.owner,
        currency: wallet.currency_code,
        balance: wallet.balance,
      },
      {
        kind: currency2.kind,
        owner_type: wallet.owner_type,
        owner: wallet.owner,
        currency: currency2.code,
        balance: "0",
      },
    ]),
    meta: {
      page: 1,
      limit: 10,
      page_count: 2,
      total_count: 2,
    },
  });
});

it("should list currencies as wallets", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE, WALLET_OWNER } = require("@src/constants");
  const { orderBy } = require("lodash");

  const [user, ...currencies] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/wallets")
    .auth(accessToken.jti, { type: "bearer" })
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    wallets: serializeDocument(
      orderBy(currencies, ["code"], ["asc"]).map(currency => ({
        kind: currency.kind,
        owner_type: WALLET_OWNER.USER,
        owner: user._id,
        currency: currency.code,
        balance: "0",
      })),
    ),
    meta: {
      page: 1,
      limit: 10,
      page_count: 2,
      total_count: 2,
    },
  });
});

it("should list 0 wallets, if page doesn't exist", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);
  await factory.cryptoWallet(user, currency);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/wallets")
    .auth(accessToken.jti, { type: "bearer" })
    .query({
      page: 2,
    })
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    wallets: [],
    meta: {
      page: 2,
      limit: 10,
      page_count: 0,
      total_count: 2,
    },
  });
});

it("should list only limited amount of wallets", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);
  const wallet = await factory.cryptoWallet(user, currency);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/wallets")
    .auth(accessToken.jti, { type: "bearer" })
    .query({
      limit: 1,
    })
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    wallets: serializeDocument([
      {
        kind: wallet.kind,
        owner_type: wallet.owner_type,
        owner: wallet.owner,
        currency: wallet.currency_code,
        balance: wallet.balance,
      },
    ]),
    meta: {
      page: 1,
      limit: 1,
      page_count: 1,
      total_count: 2,
    },
  });
});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const { body } = await http()
    .get("/v1/wallets")
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});
