"use strict";

/* eslint-env jest */

const faker = require("faker");

// ------------------------- Library -------------------------

exports.sendVerificationEmail = jest.fn()
  .mockName("sendVerificationEmail")
  .mockImplementation(async () => faker.datatype.uuid());

exports.validateWebhook = jest.fn()
  .mockName("validateWebhook")
  .mockImplementation(() => true);
