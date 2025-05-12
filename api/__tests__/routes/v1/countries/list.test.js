"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should list countries", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, country] = await Promise.all([
    factory.user(),
    factory.country(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/countries")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    countries: [serializeDocument(country)],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });
});

it("should list 0 countries, if page doesn't exist", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user] = await Promise.all([
    factory.user(),
    factory.country(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/countries")
    .query({
      page: 2,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    countries: [],
    meta: {
      page: 2,
      limit: 10,
      page_count: 0,
      total_count: 1,
    },
  });
});

it("should list only limited amount of countries", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { orderBy } = require("lodash");

  const promises = [];

  for (let i = 0; i < 2; i++) promises.push(factory.country());

  const [user, ...countries] = await Promise.all([
    factory.user(),
    ...promises,
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/countries")
    .query({
      limit: 1,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    countries: [serializeDocument(orderBy(countries, ["code"], ["asc"])[0])],
    meta: {
      page: 1,
      limit: 1,
      page_count: 1,
      total_count: 2,
    },
  });
});

it("should list all of the countries", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { orderBy } = require("lodash");

  const promises = [];

  for (let i = 0; i < 11; i++) promises.push(factory.country());

  const [user, ...countries] = await Promise.all([
    factory.user(),
    ...promises,
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/countries")
    .query({
      limit: 0,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    countries: orderBy(countries.map(serializeDocument), ["code"], ["asc"]),
    meta: {
      page: 1,
      limit: 0,
      page_count: 11,
      total_count: 11,
    },
  });
});

it("should list countries only with the selected fields", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const [user, country] = await Promise.all([
    factory.user(),
    factory.country(),
  ]);

  const accessToken = await factory.accessToken(user);

  const select = ["code", "name"];

  const { body } = await http()
    .get("/v1/countries")
    .query({
      select,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    countries: [serializeDocument(country, select)],
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
    .get("/v1/countries")
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});
