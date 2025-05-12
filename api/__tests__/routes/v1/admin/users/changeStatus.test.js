"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/admin/users";

it("should change a System User's status", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, USER_STATUS } = require("@src/constants");
  const { User } = require("@src/models");

  const user = await factory.user();
  const accessToken = await factory.accessToken(user);

  let system_user_created = await factory.user();

  const changingProperty = "status";
  const changingValue = USER_STATUS.SUSPENDED;

  system_user_created = JSON.parse(JSON.stringify(system_user_created));

  system_user_created[changingProperty] = changingValue;
  delete system_user_created.updated_at;
  delete system_user_created.created_at;
  delete system_user_created[changingProperty];//TODO: compare status after and before

  await http()
    .patch(`${ endpoint }/${ system_user_created.id }`)
    .send({
      [changingProperty]: changingValue,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  const system_users = await User.find({});
  const system_user = JSON.parse(JSON.stringify(system_users[1]));
  delete system_user.updated_at;
  delete system_user.created_at;

  expect(system_user).toEqual(system_user_created);

});
