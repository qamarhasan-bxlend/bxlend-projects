"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/admin/users";

it("should fetch System User by id", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();
  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(`${ endpoint }/${ user._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ user: serializeDocument(user) });

});

it("should respond with 404 in case of wrong id", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");
  const {
    Types: { ObjectId },
  } = require("mongoose");

  const user = await factory.user();
  const accessToken = await factory.accessToken(user);

  //Creating a wrong transaction id
  let wrong_user_id = new ObjectId();
  while (wrong_user_id.equals(user._id)) wrong_user_id = new ObjectId();

  const { body } = await http()
    .get(`${ endpoint }/${ wrong_user_id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: ERROR.USER_NOT_FOUND });

});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const user = await factory.user();

  const { body } = await http()
    .get(`${ endpoint }/${ user._id }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });

});

it("should respond with 401 in case of wrong access token", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const user = await factory.user();

  const { body } = await http()
    .get(`${ endpoint }/${ user._id }`)
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
    .get(`${ endpoint }/${ user._id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.UNAUTHORIZED });

});
