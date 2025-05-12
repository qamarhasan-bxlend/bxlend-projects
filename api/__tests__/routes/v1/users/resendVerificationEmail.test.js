"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should resend user's verification email", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, STATUS_MESSAGE, AUTH_SCOPE, VERIFICATION_STATUS } = require("@src/constants");
  const { User, Verification, EmailVerification } = require("@src/models");
  const { Mailgun } = require("@src/lib");

  const user = await factory.user({ email_verified_at: null });

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_EMAIL]);

  const { body } = await http()
    .post("/v1/users/me/email/verification/resend")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send()
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ message: STATUS_MESSAGE.OK });

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(1);

  expect(Mailgun.validateWebhook.mock.calls.length).toBe(0);

  expect(Mailgun.sendVerificationEmail.mock.calls.length).toBe(1);
  expect(Mailgun.sendVerificationEmail.mock.calls[0].length).toBe(2);
  expect(Mailgun.sendVerificationEmail.mock.calls[0][0]).toBeInstanceOf(User);
  expect(Mailgun.sendVerificationEmail.mock.calls[0][1]).toBeInstanceOf(EmailVerification);

  const newVerification = await EmailVerification.findOne();

  expect(newVerification.status).toEqual(VERIFICATION_STATUS.PENDING);
});

it("should resend user's verification email & cancel previous request", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, STATUS_MESSAGE, AUTH_SCOPE, VERIFICATION_STATUS } = require("@src/constants");
  const { User, Verification, EmailVerification } = require("@src/models");
  const { Mailgun } = require("@src/lib");

  const user = await factory.user({ email_verified_at: null });
  const [accessToken, verification] = await Promise.all([
    factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_EMAIL]),
    factory.emailVerification(user),
  ]);

  const { body } = await http()
    .post("/v1/users/me/email/verification/resend")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send()
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ message: STATUS_MESSAGE.OK });

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(2);

  expect(Mailgun.validateWebhook.mock.calls.length).toBe(0);

  const previousVerification = await EmailVerification.findById(verification._id);

  expect(previousVerification.status).toEqual(VERIFICATION_STATUS.CANCELED);

  expect(Mailgun.sendVerificationEmail.mock.calls.length).toBe(1);
  expect(Mailgun.sendVerificationEmail.mock.calls[0].length).toBe(2);
  expect(Mailgun.sendVerificationEmail.mock.calls[0][0]).toBeInstanceOf(User);
  expect(Mailgun.sendVerificationEmail.mock.calls[0][1]).toBeInstanceOf(EmailVerification);

  const newVerification = await EmailVerification.findOne({
    _id: {
      $ne: verification._id,
    },
  });

  expect(newVerification.status).toEqual(VERIFICATION_STATUS.PENDING);
});

it("shouldn't allow resending user's verification email if it's already verified", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, AUTH_SCOPE, ERROR } = require("@src/constants");
  const { Verification } = require("@src/models");
  const { Mailgun } = require("@src/lib");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_EMAIL]);

  const { body } = await http()
    .post("/v1/users/me/email/verification/resend")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send()
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });

  expect(Mailgun.validateWebhook.mock.calls.length).toBe(0);
  expect(Mailgun.sendVerificationEmail.mock.calls.length).toBe(0);

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(0);
});

it("shouldn't be able to resend user's verification email without having the required scope(s)", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");
  const { Verification } = require("@src/models");
  const { Mailgun } = require("@src/lib");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .post("/v1/users/me/email/verification/resend")
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send()
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });

  expect(Mailgun.validateWebhook.mock.calls.length).toBe(0);
  expect(Mailgun.sendVerificationEmail.mock.calls.length).toBe(0);

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(0);
});

it("shouldn't be able to resend another user's email verification", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, AUTH_SCOPE, ERROR } = require("@src/constants");
  const { Verification } = require("@src/models");
  const { Mailgun } = require("@src/lib");

  const [user, anotherUser] = await Promise.all([
    factory.user(),
    factory.user(),
  ]);

  const accessToken = await factory.accessToken(user, [AUTH_SCOPE.WRITE_USER_EMAIL]);

  const { body } = await http()
    .post(`/v1/users/${ anotherUser._id }/email/verification/resend`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .send()
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });

  expect(Mailgun.validateWebhook.mock.calls.length).toBe(0);
  expect(Mailgun.sendVerificationEmail.mock.calls.length).toBe(0);

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(0);
});
