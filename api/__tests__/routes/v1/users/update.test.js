"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should update user (by id)", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE, AUTH_SCOPE } = require("@src/constants");
  const { User } = require("@src/models");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.READ_USER_PROFILE, AUTH_SCOPE.WRITE_USER_PROFILE]);

  const userData = {
    name: {
      first: "Ardalan",
    },
  };

  const { body } = await http()
    .patch(`/v1/users/${ user._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      user: userData,
    })
    .expect(STATUS_CODE.OK);

  const serialized = serializeDocument(user, ["id", "name", "birthdate", "gender", "kyc_status", "created_at", "updated_at"]);

  const { updated_at } = await User.findById(user._id);

  serialized.updated_at = updated_at.toJSON();

  expect(body).toEqual({
    user: {
      ...serialized,
      name: {
        ...(serialized.name ?? {}),
        first: userData.name.first,
      },
    },
  });
});

it("should update user (by 'me' instead of id)", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE, AUTH_SCOPE } = require("@src/constants");
  const { User } = require("@src/models");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.READ_USER_PROFILE, AUTH_SCOPE.WRITE_USER_PROFILE]);

  const userData = {
    name: {
      first: "Ardalan",
    },
  };

  const { body } = await http()
    .patch("/v1/users/me")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      user: userData,
    })
    .expect(STATUS_CODE.OK);

  const serialized = serializeDocument(user, ["id", "name", "birthdate", "gender", "kyc_status", "created_at", "updated_at"]);

  const { updated_at } = await User.findById(user._id);

  serialized.updated_at = updated_at.toJSON();

  expect(body).toEqual({
    user: {
      ...serialized,
      name: {
        ...(serialized.name ?? {}),
        first: userData.name.first,
      },
    },
  });
});

it("should respond with 404 in case of wrong id", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR, AUTH_SCOPE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.READ_USER_PROFILE, AUTH_SCOPE.WRITE_USER_PROFILE]);

  const { body } = await http()
    .patch("/v1/users/some-id")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      user: {
        name: {
          first: "Ardalan",
        },
      },
    })
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: ERROR.USER_NOT_FOUND });
});

it("should respond with 403 in case of attempting to fetch another user", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR, AUTH_SCOPE } = require("@src/constants");

  const [user, anotherUser] = await Promise.all([
    factory.user(),
    factory.user(),
  ]);

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.READ_USER_PROFILE, AUTH_SCOPE.WRITE_USER_PROFILE]);

  const { body } = await http()
    .patch(`/v1/users/${ anotherUser._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      user: {
        name: {
          first: "Ardalan",
        },
      },
    })
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });
});

it("should respond with 422 in case of sending wrong data", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR, AUTH_SCOPE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.READ_USER_PROFILE, AUTH_SCOPE.WRITE_USER_PROFILE]);

  const { body } = await http()
    .patch("/v1/users/me")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      user: {
        foo: "bar",
      },
    })
    .expect(STATUS_CODE.UNPROCESSABLE_ENTITY);

  expect(body).toEqual({
    error: ERROR.UNPROCESSABLE_ENTITY,
    details: {
      "user.foo": [
        "\"user.foo\" is not allowed",
      ],
    },
  });
});
