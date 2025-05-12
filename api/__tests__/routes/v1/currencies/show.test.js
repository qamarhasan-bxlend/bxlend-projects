"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should fetch currency by id", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(`/v1/currencies/${ currency._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ currency: serializeDocument(currency) });
});

it("should respond with 404 in case of wrong id", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/currencies/some-id")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: ERROR.CURRENCY_NOT_FOUND });
});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const currency = await factory.fiatCurrency();

  const { body } = await http()
    .get(`/v1/currencies/${ currency._id }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});

it("should respond with 401 in case of wrong access token", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const currency = await factory.fiatCurrency();

  const { body } = await http()
    .get(`/v1/currencies/${ currency._id }`)
    .set("Authorization", "Bearer some-wrong-value")
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});

it("should respond with 401 in case of deactivated user", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
  ]);

  const accessToken = await factory.accessToken(user);

  user.deleted_at = new Date();

  await user.save();

  const { body } = await http()
    .get(`/v1/currencies/${ currency._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});
