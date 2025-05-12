"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should verify user's email address", async () => {
  const { factory, http } = require("@tests/internals");
  const { WEBSITE_URI } = require("@src/config");
  const { STATUS_CODE, VERIFICATION_STATUS } = require("@src/constants");
  const { User, Verification, EmailVerification } = require("@src/models");
  const { v4: uuidV4 } = require("uuid");

  const user = await factory.user({ email_verified_at: null });

  const token = uuidV4();

  const verification = await factory.emailVerification(user, { token });

  const { headers } = await http()
    .get(`/v1/verifications/email/verify/${ token }`)
    .expect(STATUS_CODE.FOUND);

  expect(headers.location).toEqual(WEBSITE_URI);

  const updatedUser = await User.findById(user._id);

  expect(updatedUser.email_verified_at).toBeInstanceOf(Date);

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(1);

  const updatedVerification = await EmailVerification.findById(verification._id);

  expect(updatedVerification.status).toEqual(VERIFICATION_STATUS.VERIFIED);
});

it("shouldn't allow verifying user's email address if the token doesn't match any active verifications", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");
  const { User, Verification } = require("@src/models");
  const { v4: uuidV4 } = require("uuid");

  const user = await factory.user({ email_verified_at: null });

  const token = uuidV4();

  const { body } = await http()
    .get(`/v1/verifications/email/verify/${ token }`)
    .expect(STATUS_CODE.FORBIDDEN);

  expect(body).toEqual({ error: ERROR.FORBIDDEN });

  const updatedUser = await User.findById(user._id);

  expect(updatedUser.email_verified_at).toBeNull();

  const verificationsCount = await Verification.countDocuments();

  expect(verificationsCount).toBe(0);
});
