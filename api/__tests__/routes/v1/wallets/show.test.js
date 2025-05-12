"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should show the wallets' address per chosen currency", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { CryptoWallet } = require("@src/models");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  await factory.internalWallet(currency);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(`/v1/wallets/${ currency.id }`)
    .auth(accessToken.jti, { type: "bearer" })
    .expect(STATUS_CODE.OK);

  const wallet = await CryptoWallet.findOne({
    currency_code: currency.code,
  });

  expect(wallet).not.toBeNull();
  expect(body).toEqual({
    wallet: serializeDocument(wallet),
  });

});

it("should show the wallets' address per chosen currency with selected fields", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { CryptoWallet } = require("@src/models");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  await factory.internalWallet(currency);

  const accessToken = await factory.accessToken(user);
  const select = ["address", "balance"];

  const { body } = await http()
    .get(`/v1/wallets/${ currency.id }`)
    .query({
      select,
    })
    .auth(accessToken.jti, { type: "bearer" })
    .expect(STATUS_CODE.OK);

  const wallet = await CryptoWallet.findOne({
    currency_code: currency.code,
  });

  expect(wallet).not.toBeNull();
  expect(body).toEqual({
    wallet: serializeDocument(wallet, select),
  });

});

it("should show the existing wallet address per chosen currency with selected fields", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const wallet = await factory.cryptoWallet(user, currency);

  const accessToken = await factory.accessToken(user);
  const select = ["address", "balance"];

  const { body } = await http()
    .get(`/v1/wallets/${ currency.id }`)
    .query({
      select,
    })
    .auth(accessToken.jti, { type: "bearer" })
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    wallet: serializeDocument(wallet, select),
  });

});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const currency = await factory.cryptoCurrency();

  const { body } = await http()
    .get(`/v1/wallets/${ currency._id }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});

it("should respond with 404 in case of a Non-Existing Currency", async () => {
  const { http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");
  const { Types: { ObjectId } } = require("mongoose");

  const { body } = await http()
    .get(`/v1/wallets/${ new ObjectId }`)
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: ERROR.CURRENCY_NOT_FOUND });
});
