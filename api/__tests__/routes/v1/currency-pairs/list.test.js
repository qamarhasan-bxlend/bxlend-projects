"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should list currency pairs", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, pair] = await Promise.all([
    factory.user(),
    factory.currencyPair(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/currency-pairs")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    pairs: [serializeDocument(pair)],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });
});

it("should list 0 currency pairs, if page doesn't exist", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user] = await Promise.all([
    factory.user(),
    factory.currencyPair(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/currency-pairs")
    .query({
      page: 2,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    pairs: [],
    meta: {
      page: 2,
      limit: 10,
      page_count: 0,
      total_count: 1,
    },
  });
});

it("should list only limited amount of currency pairs", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { orderBy } = require("lodash");

  const [user, ...pairs] = await Promise.all([
    factory.user(),
    factory.currencyPair(),
    factory.currencyPair(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/currency-pairs")
    .query({
      limit: 1,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    pairs: [serializeDocument(orderBy(pairs, ["id"], ["asc"])[0])],
    meta: {
      page: 1,
      limit: 1,
      page_count: 1,
      total_count: 2,
    },
  });
});

it("should not be able to list all of the currency pairs", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/currency-pairs")
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

it("should list currency pairs only with the selected fields", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, pair] = await Promise.all([
    factory.user(),
    factory.currencyPair(),
  ]);

  const accessToken = await factory.accessToken(user);

  const select = ["id", "currencies", "symbol"];

  const { body } = await http()
    .get("/v1/currency-pairs")
    .query({
      select,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    pairs: [serializeDocument(pair, select)],
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
    .get("/v1/currency-pairs")
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});
