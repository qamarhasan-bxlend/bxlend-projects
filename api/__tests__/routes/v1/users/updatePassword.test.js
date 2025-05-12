"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should update user's password", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, STATUS_MESSAGE, AUTH_SCOPE } = require("@src/constants");
  const { User } = require("@src/models");
  const bcrypt = require("bcrypt");

  const old_password = "123456789";
  const new_password = "1234567890";

  const user = await factory.user({ password: old_password });

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_PASSWORD]);

  const { body } = await http()
    .patch("/v1/users/me/password")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      old_password,
      new_password,
    })
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ message: STATUS_MESSAGE.OK });

  const updatedUser = await User.findById(user._id);

  expect(updatedUser.password).not.toEqual(user.password);

  expect(bcrypt.compareSync(new_password, updatedUser.password)).toBe(true);
});

it("should just respond ok if it's the same password", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, STATUS_MESSAGE, AUTH_SCOPE } = require("@src/constants");
  const { User } = require("@src/models");

  const password = "123456789";

  const user = await factory.user({ password });

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_PASSWORD]);

  const { body } = await http()
    .patch("/v1/users/me/password")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      old_password: password,
      new_password: password,
    })
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ message: STATUS_MESSAGE.OK });

  const updatedUser = await User.findById(user._id);

  expect(updatedUser.password).toEqual(user.password);
});

it("shouldn't be able to update user's password without having the required scope(s)", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");
  const { User } = require("@src/models");

  const old_password = "123456789";
  const new_password = "1234567890";

  const user = await factory.user({ password: old_password });

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .patch("/v1/users/me/password")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      old_password,
      new_password,
    })
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });

  const updatedUser = await User.findById(user._id);

  expect(updatedUser.password).toEqual(user.password);
});

it("shouldn't be able to update another user's password", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, AUTH_SCOPE, ERROR } = require("@src/constants");
  const { User } = require("@src/models");

  const old_password = "123456789";
  const new_password = "1234567890";

  const [user, anotherUser] = await Promise.all([
    factory.user({ password: old_password }),
    factory.user({ password: old_password }),
  ]);

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_PASSWORD]);

  const { body } = await http()
    .patch(`/v1/users/${ anotherUser._id }/password`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      old_password,
      new_password,
    })
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });

  const updatedUser = await User.findById(anotherUser._id);

  expect(updatedUser.password).toEqual(anotherUser.password);
});
