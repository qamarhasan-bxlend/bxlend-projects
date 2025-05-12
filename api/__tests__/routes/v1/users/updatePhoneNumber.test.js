"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should update user's phone number", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, STATUS_MESSAGE, AUTH_SCOPE, VERIFICATION_STATUS } = require("@src/constants");
  const { User, Verification } = require("@src/models");
  const { Vonage } = require("@src/lib");

  const password = "123456789";

  const user = await factory.user({ password });

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_PHONE_NUMBER]);

  const phoneNumber = "+12133734254";

  const { body } = await http()
    .patch("/v1/users/me/phone-number")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      phone_number: phoneNumber,
      password,
    })
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ message: STATUS_MESSAGE.OK });

  const updatedUser = await User.findById(user._id);

  expect(updatedUser.phone_number).toEqual(phoneNumber);

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(1);

  expect(Vonage.getVerificationInfo.mock.calls.length).toBe(0);
  expect(Vonage.checkVerificationCode.mock.calls.length).toBe(0);
  expect(Vonage.cancelVerificationRequest.mock.calls.length).toBe(0);

  expect(Vonage.sendVerificationCode.mock.calls.length).toBe(1);
  expect(Vonage.sendVerificationCode.mock.calls[0].length).toBe(1);
  expect(Vonage.sendVerificationCode.mock.calls[0][0]).toBeInstanceOf(User);

  const newVerification = await Verification.findOne();

  expect(newVerification.status).toEqual(VERIFICATION_STATUS.PENDING);
});

it("should update user's phone number & cancel previous request", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, STATUS_MESSAGE, AUTH_SCOPE, VERIFICATION_STATUS } = require("@src/constants");
  const { User, Verification } = require("@src/models");
  const { Vonage } = require("@src/lib");

  const password = "123456789";

  const user = await factory.user({ password });
  const [accessToken, verification] = await Promise.all([
    factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_PHONE_NUMBER]),
    factory.phoneNumberVerification(user),
  ]);

  const phoneNumber = "+12133734254";

  const { body } = await http()
    .patch("/v1/users/me/phone-number")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      phone_number: phoneNumber,
      password,
    })
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ message: STATUS_MESSAGE.OK });

  const updatedUser = await User.findById(user._id);

  expect(updatedUser.phone_number).toEqual(phoneNumber);

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(2);

  expect(Vonage.getVerificationInfo.mock.calls.length).toBe(0);
  expect(Vonage.checkVerificationCode.mock.calls.length).toBe(0);

  expect(Vonage.cancelVerificationRequest.mock.calls.length).toBe(1);
  expect(Vonage.cancelVerificationRequest.mock.calls[0].length).toBe(1);
  expect(Vonage.cancelVerificationRequest.mock.calls[0][0]).toBeInstanceOf(Verification);

  const previousVerification = await Verification.findById(verification._id);

  expect(previousVerification.status).toEqual(VERIFICATION_STATUS.CANCELED);

  expect(Vonage.sendVerificationCode.mock.calls.length).toBe(1);
  expect(Vonage.sendVerificationCode.mock.calls[0].length).toBe(1);
  expect(Vonage.sendVerificationCode.mock.calls[0][0]).toBeInstanceOf(User);

  const newVerification = await Verification.findOne({
    _id: {
      $ne: verification._id,
    },
  });

  expect(newVerification.status).toEqual(VERIFICATION_STATUS.PENDING);
});

it("should just respond if it's the same phone number", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, STATUS_MESSAGE, AUTH_SCOPE } = require("@src/constants");
  const { User, Verification } = require("@src/models");
  const { Vonage } = require("@src/lib");

  const password = "123456789";

  const user = await factory.user({ password });

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_PHONE_NUMBER]);

  const phoneNumber = "+12133734253";

  const { body } = await http()
    .patch("/v1/users/me/phone-number")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      phone_number: phoneNumber,
      password,
    })
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ message: STATUS_MESSAGE.OK });

  const updatedUser = await User.findById(user._id);

  expect(updatedUser.phone_number).toEqual(phoneNumber);

  expect(Vonage.getVerificationInfo.mock.calls.length).toBe(0);
  expect(Vonage.checkVerificationCode.mock.calls.length).toBe(0);
  expect(Vonage.cancelVerificationRequest.mock.calls.length).toBe(0);
  expect(Vonage.sendVerificationCode.mock.calls.length).toBe(0);

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(0);
});

it("shouldn't be able to update user's phone number without having the required scope(s)", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");
  const { Verification } = require("@src/models");
  const { Vonage } = require("@src/lib");

  const password = "123456789";

  const user = await factory.user({ password });

  const accessToken = await factory.accessToken(user);

  const phoneNumber = "+12133734254";

  const { body } = await http()
    .patch("/v1/users/me/phone-number")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      phone_number: phoneNumber,
      password,
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

it("shouldn't be able to update another user's phone number", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, AUTH_SCOPE, ERROR } = require("@src/constants");
  const { Verification } = require("@src/models");
  const { Vonage } = require("@src/lib");

  const password = "123456789";

  const [user, anotherUser] = await Promise.all([
    factory.user({ password }),
    factory.user({ password }),
  ]);

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_PHONE_NUMBER]);

  const phoneNumber = "+12133734254";

  const { body } = await http()
    .patch(`/v1/users/${ anotherUser._id }/phone-number`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send({
      phone_number: phoneNumber,
      password,
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
