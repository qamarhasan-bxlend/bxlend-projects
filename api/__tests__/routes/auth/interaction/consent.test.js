"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should authorize user access to the client", async () => {
  const { factory, http } = require("@tests/internals");
  const { WEBSITE_CLIENT_ID, WEBSITE_CLIENT_REDIRECT_URI } = require("@src/config");
  const { STATUS_CODE, TOKEN_KIND } = require("@src/constants");
  const { Token } = require("@src/models");
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

  let interactionId = cookies._interaction.value;

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

  const interactionResponse = await http()
    .get(`/auth/${ interactionId }`)
    .set("Cookie", authResponse.headers["set-cookie"])
    .expect(STATUS_CODE.SEE_OTHER);

  cookies = setCookie.parse(interactionResponse, {
    decodeValues: true,
    map: true,
  });

  interactionId = cookies._interaction.value;

  await http()
    .get(`/auth/interaction/${ interactionId }`)
    .set("Cookie", interactionResponse.headers["set-cookie"])
    .expect(STATUS_CODE.OK);

  await http()
    .post(`/auth/interaction/${ interactionId }/confirm`)
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set("Cookie", interactionResponse.headers["set-cookie"])
    .send()
    .expect(STATUS_CODE.SEE_OTHER);

  const consentResponse = await http()
    .get(`/auth/${ interactionId }`)
    .set("Cookie", interactionResponse.headers["set-cookie"])
    .expect(STATUS_CODE.SEE_OTHER);

  expect(consentResponse.headers.location).toMatch(new RegExp(`^${WEBSITE_CLIENT_REDIRECT_URI}`));

  expect(await Token.countDocuments()).toBe(1);

  const authorizationToken = await Token.findOne({
    kind: TOKEN_KIND.AUTHORIZATION_CODE,
  });

  expect(authorizationToken).toBeDefined();
});
