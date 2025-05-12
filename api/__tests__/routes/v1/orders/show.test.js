"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/orders";

it("should fetch Order by id", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, cryptoCurrency1, cryptoCurrency2] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);

  const [accessToken, wallet1, wallet2, pair] = await Promise.all([
    factory.accessToken(user),
    factory.cryptoWallet(user, cryptoCurrency1),
    factory.cryptoWallet(user, cryptoCurrency2),
    factory.currencyPair([cryptoCurrency1, cryptoCurrency2]),
  ]);

  let marketOrder = await factory.marketOrder(user, pair, [wallet1, wallet2]);

  const { body } = await http()
    .get(`${ endpoint }/${ marketOrder._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ order: serializeDocument(marketOrder) });

});

it("should respond with 404 in case of wrong id", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");
  const {
    Types: { ObjectId },
  } = require("mongoose");

  const [user, cryptoCurrency1, cryptoCurrency2] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);

  const [accessToken, wallet1, wallet2, pair] = await Promise.all([
    factory.accessToken(user),
    factory.cryptoWallet(user, cryptoCurrency1),
    factory.cryptoWallet(user, cryptoCurrency2),
    factory.currencyPair([cryptoCurrency1, cryptoCurrency2]),
  ]);

  const marketOrder = await factory.marketOrder(user, pair, [wallet1, wallet2]);

  //Creating a wrong transaction id
  let wrong_order_id = new ObjectId();
  while (wrong_order_id.equals(marketOrder._id)) wrong_order_id = new ObjectId();

  const { body } = await http()
    .get(`${ endpoint }/${ wrong_order_id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: ERROR.NOT_FOUND });

});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, cryptoCurrency1, cryptoCurrency2] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);

  const [, wallet1, wallet2, pair] = await Promise.all([
    factory.accessToken(user),
    factory.cryptoWallet(user, cryptoCurrency1),
    factory.cryptoWallet(user, cryptoCurrency2),
    factory.currencyPair([cryptoCurrency1, cryptoCurrency2]),
  ]);

  const marketOrder = await factory.marketOrder(user, pair, [wallet1, wallet2]);

  const { body } = await http()
    .get(`${ endpoint }/${ marketOrder._id }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});

it("should respond with 401 in case of wrong access token", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, cryptoCurrency1, cryptoCurrency2] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);

  const [, wallet1, wallet2, pair] = await Promise.all([
    factory.accessToken(user),
    factory.cryptoWallet(user, cryptoCurrency1),
    factory.cryptoWallet(user, cryptoCurrency2),
    factory.currencyPair([cryptoCurrency1, cryptoCurrency2]),
  ]);

  const marketOrder = await factory.marketOrder(user, pair, [wallet1, wallet2]);

  const { body } = await http()
    .get(`${ endpoint }/${ marketOrder._id }`)
    .set("Authorization", "Bearer some-wrong-value")
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});

it("should respond with 401 in case of deactivated user", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, cryptoCurrency1, cryptoCurrency2] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);

  const [accessToken, wallet1, wallet2, pair] = await Promise.all([
    factory.accessToken(user),
    factory.cryptoWallet(user, cryptoCurrency1),
    factory.cryptoWallet(user, cryptoCurrency2),
    factory.currencyPair([cryptoCurrency1, cryptoCurrency2]),
  ]);

  const marketOrder = await factory.marketOrder(user, pair, [wallet1, wallet2]);

  user.deleted_at = new Date();

  await user.save();

  const { body } = await http()
    .get(`${ endpoint }/${ marketOrder._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});
