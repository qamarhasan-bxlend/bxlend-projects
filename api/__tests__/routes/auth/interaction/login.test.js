"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should login user with email/password", async () => {
  const { factory, http } = require("@tests/internals");
  const { WEBSITE_CLIENT_ID, WEBSITE_CLIENT_REDIRECT_URI } = require("@src/config");
  const { STATUS_CODE } = require("@src/constants");
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
    .get(`/auth/interaction/${ interactionId }`)
    .set("Cookie", authResponse.headers["set-cookie"])
    .expect(STATUS_CODE.OK);

  const password = faker.internet.password();

  const user = await factory.user({ password });

  await http()
    .post(`/auth/interaction/${ interactionId }/login`)
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set("Cookie", authResponse.headers["set-cookie"])
    .send({
      login: user.email,
      password,
    })
    .expect(STATUS_CODE.SEE_OTHER);
});

it("should fail to login user with 422 status", async () => {
  const { factory, http } = require("@tests/internals");
  const { WEBSITE_CLIENT_ID, WEBSITE_CLIENT_REDIRECT_URI } = require("@src/config");
  const { STATUS_CODE } = require("@src/constants");
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
    .get(`/auth/interaction/${ interactionId }`)
    .set("Cookie", authResponse.headers["set-cookie"])
    .expect(STATUS_CODE.OK);

  const password = faker.internet.password();

  const user = await factory.user({ password });

  await http()
    .post(`/auth/interaction/${ interactionId }/login`)
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set("Cookie", authResponse.headers["set-cookie"])
    .send({
      login: user.email,
    })
    .expect(STATUS_CODE.UNPROCESSABLE_ENTITY);
});

it("should abort login process", async () => {
  const { http } = require("@tests/internals");
  const { WEBSITE_CLIENT_ID, WEBSITE_CLIENT_REDIRECT_URI } = require("@src/config");
  const { STATUS_CODE } = require("@src/constants");
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
    .get(`/auth/interaction/${ interactionId }`)
    .set("Cookie", authResponse.headers["set-cookie"])
    .expect(STATUS_CODE.OK);

  await http()
    .get(`/auth/interaction/${ interactionId }/abort`)
    .set("Cookie", authResponse.headers["set-cookie"])
    .expect(STATUS_CODE.SEE_OTHER);
});
