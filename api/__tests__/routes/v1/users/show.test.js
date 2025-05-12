"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should fetch user (by id)", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(`/v1/users/${ user._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ user: serializeDocument(user, ["id", "name", "birthdate", "gender", "kyc_status", "created_at", "updated_at"]) });
});

it("should fetch user (by 'me' instead of id)", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/users/me")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ user: serializeDocument(user, ["id", "name", "birthdate", "gender", "kyc_status", "created_at", "updated_at"]) });
});

it("should fetch user (including email and phone number)", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE, AUTH_SCOPE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(
    user,
    [
      AUTH_SCOPE.READ_USER_PROFILE,
      AUTH_SCOPE.READ_USER_EMAIL,
      AUTH_SCOPE.READ_USER_PHONE_NUMBER,
    ],
  );

  const { body } = await http()
    .get("/v1/users/me")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ user: serializeDocument(user) });
});

it("should respond with 404 in case of wrong id", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get("/v1/users/some-id")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: ERROR.USER_NOT_FOUND });
});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const user = await factory.user();

  const { body } = await http()
    .get(`/v1/users/${ user._id }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});

it("should respond with 401 in case of wrong access token", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const user = await factory.user();

  const { body } = await http()
    .get(`/v1/users/${ user._id }`)
    .set("Authorization", "Bearer some-wrong-value")
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});

it("should respond with 401 in case of deactivated user", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  user.deleted_at = new Date();

  await user.save();

  const { body } = await http()
    .get("/v1/users/me")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });
});

it("should respond with 403 in case of attempting to fetch another user", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const [user, anotherUser] = await Promise.all([
    factory.user(),
    factory.user(),
  ]);

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(`/v1/users/${ anotherUser._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });
});
