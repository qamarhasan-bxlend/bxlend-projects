"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should fetch currency pair by id", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, pair] = await Promise.all([
    factory.user(),
    factory.currencyPair(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(`/v1/currency-pairs/${ pair._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ pair: serializeDocument(pair) });
});

it("should respond with 404 in case of wrong id", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/currency-pairs/some-id")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: ERROR.CURRENCY_PAIR_NOT_FOUND });
});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const pair = await factory.currencyPair();

  const { body } = await http()
    .get(`/v1/currency-pairs/${ pair._id }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});

it("should respond with 401 in case of wrong access token", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const pair = await factory.currencyPair();

  const { body } = await http()
    .get(`/v1/currency-pairs/${ pair._id }`)
    .set("Authorization", "Bearer some-wrong-value")
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});

it("should respond with 401 in case of deactivated user", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, pair] = await Promise.all([
    factory.user(),
    factory.currencyPair(),
  ]);

  const accessToken = await factory.accessToken(user);

  user.deleted_at = new Date();

  await user.save();

  const { body } = await http()
    .get(`/v1/currency-pairs/${ pair._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});
