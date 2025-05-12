"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should list currencies", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/currencies")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    currencies: [serializeDocument(currency)],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });
});

it("should list 0 currencies, if page doesn't exist", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/currencies")
    .query({
      page: 2,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    currencies: [],
    meta: {
      page: 2,
      limit: 10,
      page_count: 0,
      total_count: 1,
    },
  });
});

it("should list only limited amount of currencies", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { orderBy } = require("lodash");

  const [user, ...currencies] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
    factory.fiatCurrency(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/currencies")
    .query({
      limit: 1,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    currencies: [orderBy(serializeDocument(currencies), ["code"], ["asc"])[0]],
    meta: {
      page: 1,
      limit: 1,
      page_count: 1,
      total_count: 2,
    },
  });
});

it("should not be able to list all of the currencies", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/currencies")
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

it("should list currencies only with the selected fields", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const accessToken = await factory.accessToken(user);

  const select = ["code", "name"];

  const { body } = await http()
    .get("/v1/currencies")
    .query({
      select,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    currencies: [serializeDocument(currency, select)],
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
    .get("/v1/currencies")
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});
