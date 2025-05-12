"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should register user with email/password", async () => {
  const { http } = require("@tests/internals");
  const { WEBSITE_CLIENT_ID, WEBSITE_CLIENT_REDIRECT_URI } = require("@src/config");
  const { STATUS_CODE } = require("@src/constants");
  const { User } = require("@src/models");
  const faker = require("faker");
  const setCookie = require("set-cookie-parser");
  const { v4: uuidV4 } = require("uuid");

  const responseType = "code";
  const scope = ["openid", "profile", "offline_access"].join("%20");

  const authResponse = await http()
    .get(`/auth?client_id=${
      WEBSITE_CLIENT_ID
    }&response_type=${
      responseType
    }&scope=${
      scope
    }&redirect_uri=${
      WEBSITE_CLIENT_REDIRECT_URI
    }&nonce=${
      uuidV4()
    }`)
    .expect(STATUS_CODE.SEE_OTHER);

  let cookies = setCookie.parse(authResponse, {
    decodeValues: true,
    map: true,
  });

  const interactionId = cookies._interaction.value;

  await http()
    .get(`/auth/interaction/${ interactionId }/register`)
    .set("Cookie", authResponse.headers["set-cookie"])
    .expect(STATUS_CODE.OK);

  const email = faker.internet.email();
  const password = faker.internet.password();

  await http()
    .post(`/auth/interaction/${ interactionId }/register`)
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set("Cookie", authResponse.headers["set-cookie"])
    .send({
      login: email,
      password,
      password_confirm: password,
    })
    .expect(STATUS_CODE.SEE_OTHER);

  const users = await User.find();

  expect(users.length).toBe(1);
  expect(users[0].email).toEqual(email);
});

it("should fail to register user with 422 status", async () => {
  const { http } = require("@tests/internals");
  const { WEBSITE_CLIENT_ID, WEBSITE_CLIENT_REDIRECT_URI } = require("@src/config");
  const { STATUS_CODE } = require("@src/constants");
  const { User } = require("@src/models");
  const faker = require("faker");
  const setCookie = require("set-cookie-parser");
  const { v4: uuidV4 } = require("uuid");

  const responseType = "code";
  const scope = ["openid", "profile", "offline_access"].join("%20");

  const authResponse = await http()
    .get(`/auth?client_id=${
      WEBSITE_CLIENT_ID
    }&response_type=${
      responseType
    }&scope=${
      scope
    }&redirect_uri=${
      WEBSITE_CLIENT_REDIRECT_URI
    }&nonce=${
      uuidV4()
    }`)
    .expect(STATUS_CODE.SEE_OTHER);

  let cookies = setCookie.parse(authResponse, {
    decodeValues: true,
    map: true,
  });

  const interactionId = cookies._interaction.value;

  await http()
    .get(`/auth/interaction/${ interactionId }/register`)
    .set("Cookie", authResponse.headers["set-cookie"])
    .expect(STATUS_CODE.OK);

  const email = faker.internet.email();
  const password = faker.internet.password();

  await http()
    .post(`/auth/interaction/${ interactionId }/register`)
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set("Cookie", authResponse.headers["set-cookie"])
    .send({
      login: email,
      password,
    })
    .expect(STATUS_CODE.UNPROCESSABLE_ENTITY);

  const users = await User.find();

  expect(users.length).toBe(0);
});
