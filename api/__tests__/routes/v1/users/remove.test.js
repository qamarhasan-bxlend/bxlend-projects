"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should soft-delete (deactivate) user (by id)", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, STATUS_MESSAGE, AUTH_SCOPE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.REMOVE_USER]);

  const { body } = await http()
    .delete(`/v1/users/${ user._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ message: STATUS_MESSAGE.OK });
});

it("should soft-delete (deactivate) user (by 'me' instead of id)", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, STATUS_MESSAGE, AUTH_SCOPE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.REMOVE_USER]);

  const { body } = await http()
    .delete("/v1/users/me")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ message: STATUS_MESSAGE.OK });
});

it("should respond with 404 in case of wrong id", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR, AUTH_SCOPE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.REMOVE_USER]);

  const { body } = await http()
    .delete("/v1/users/some-id")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: ERROR.USER_NOT_FOUND });
});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const user = await factory.user();

  const { body } = await http()
    .delete(`/v1/users/${ user._id }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});

it("should respond with 401 in case of wrong access token", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const user = await factory.user();

  const { body } = await http()
    .delete(`/v1/users/${ user._id }`)
    .set("Authorization", "Bearer some-wrong-value")
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});

it("should respond with 401 in case of deactivated user", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR, AUTH_SCOPE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.REMOVE_USER]);

  user.deleted_at = new Date();

  await user.save();

  const { body } = await http()
    .delete("/v1/users/me")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});

it("should respond with 403 in case of attempting to remove another user", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR, AUTH_SCOPE } = require("@src/constants");

  const [user, anotherUser] = await Promise.all([
    factory.user(),
    factory.user(),
  ]);

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.REMOVE_USER]);

  const { body } = await http()
    .delete(`/v1/users/${ anotherUser._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });
});
