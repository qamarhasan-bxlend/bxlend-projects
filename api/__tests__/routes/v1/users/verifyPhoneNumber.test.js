"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should verify user's phone number verification code", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, STATUS_MESSAGE, AUTH_SCOPE, VERIFICATION_STATUS } = require("@src/constants");
  const { User, Verification } = require("@src/models");
  const { Vonage } = require("@src/lib");

  const user = await factory.user({ phone_number_verified_at: null });
  const [accessToken, verification] = await Promise.all([
    factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_PHONE_NUMBER]),
    factory.phoneNumberVerification(user),
  ]);

  const code = "123456";

  const { body } = await http()
    .post("/v1/users/me/phone-number/verify")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      code,
    })
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ message: STATUS_MESSAGE.OK });

  const updatedUser = await User.findById(user._id);

  expect(updatedUser.phone_number_verified_at).toBeInstanceOf(Date);

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(1);

  expect(Vonage.sendVerificationCode.mock.calls.length).toBe(0);
  expect(Vonage.getVerificationInfo.mock.calls.length).toBe(0);
  expect(Vonage.cancelVerificationRequest.mock.calls.length).toBe(0);

  expect(Vonage.checkVerificationCode.mock.calls.length).toBe(1);
  expect(Vonage.checkVerificationCode.mock.calls[0].length).toBe(2);
  expect(Vonage.checkVerificationCode.mock.calls[0][0]).toBeInstanceOf(Verification);
  expect(Vonage.checkVerificationCode.mock.calls[0][1]).toEqual(code);

  const updatedVerification = await Verification.findById(verification._id);

  expect(updatedVerification.status).toEqual(VERIFICATION_STATUS.VERIFIED);
});

it("shouldn't allow verifying user's phone number verification code if it's not requested yet", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, AUTH_SCOPE, ERROR } = require("@src/constants");
  const { Verification } = require("@src/models");
  const { Vonage } = require("@src/lib");

  const user = await factory.user({ phone_number_verified_at: null });

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_PHONE_NUMBER]);

  const code = "123456";

  const { body } = await http()
    .post("/v1/users/me/phone-number/verify")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      code,
    })
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });

  expect(Vonage.getVerificationInfo.mock.calls.length).toBe(0);
  expect(Vonage.checkVerificationCode.mock.calls.length).toBe(0);
  expect(Vonage.cancelVerificationRequest.mock.calls.length).toBe(0);
  expect(Vonage.sendVerificationCode.mock.calls.length).toBe(0);

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(0);
});

it("shouldn't be able to verify user's phone number verification code without having the required scope(s)", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");
  const { Verification } = require("@src/models");
  const { Vonage } = require("@src/lib");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  const code = "123456";

  const { body } = await http()
    .post("/v1/users/me/phone-number/verify")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      code,
    })
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });

  expect(Vonage.getVerificationInfo.mock.calls.length).toBe(0);
  expect(Vonage.checkVerificationCode.mock.calls.length).toBe(0);
  expect(Vonage.cancelVerificationRequest.mock.calls.length).toBe(0);
  expect(Vonage.sendVerificationCode.mock.calls.length).toBe(0);

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(0);
});

it("shouldn't be able to verify another user's phone number verification", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, AUTH_SCOPE, ERROR } = require("@src/constants");
  const { Verification } = require("@src/models");
  const { Vonage } = require("@src/lib");

  const [user, anotherUser] = await Promise.all([
    factory.user(),
    factory.user(),
  ]);

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_PHONE_NUMBER]);

  const code = "123456";

  const { body } = await http()
    .post(`/v1/users/${ anotherUser._id }/phone-number/verify`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      code,
    })
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });

  expect(Vonage.getVerificationInfo.mock.calls.length).toBe(0);
  expect(Vonage.checkVerificationCode.mock.calls.length).toBe(0);
  expect(Vonage.cancelVerificationRequest.mock.calls.length).toBe(0);
  expect(Vonage.sendVerificationCode.mock.calls.length).toBe(0);

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(0);
});
