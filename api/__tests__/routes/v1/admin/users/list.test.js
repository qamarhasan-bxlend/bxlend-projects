"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/admin/users";

it("should list System Users", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();
  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(endpoint)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    users: [serializeDocument(user)],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });

});

it("should list 0 System User, if page doesn't exist", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();
  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(endpoint)
    .query({
      page: 2,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    users: [],
    meta: {
      page: 2,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });
});

it("should list only limited amount of Users", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();
  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(endpoint)
    .query({
      limit: 1,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    users: [serializeDocument(user)],
    meta: {
      page: 1,
      limit: 1,
      page_count: 1,
      total_count: 1,
    },
  });

});

it("should not be able to list all of the Users", async () => {
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

it("should list System Users only with the selected fields", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();
  const accessToken = await factory.accessToken(user);

  const select = ["id", "birthdate"];

  const { body } = await http()
    .get(endpoint)
    .query({
      select,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  delete body.users[0].email_verified;

  expect(body).toEqual({
    users: [serializeDocument(user, select)],
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
