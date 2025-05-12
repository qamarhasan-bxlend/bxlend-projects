"use strict";

/* eslint-env jest */

const { VONAGE_VERIFICATION_STATUS } = require("@src/constants");
const faker = require("faker");

// ------------------------- Library -------------------------

exports.sendVerificationCode = jest.fn()
  .mockName("sendVerificationCode")
  .mockImplementation(async () => faker.datatype.uuid());

exports.getVerificationInfo = jest.fn()
  .mockName("getVerificationInfo")
  .mockImplementation(async (verification) => ({
    request_id: verification.platform_id,
    account_id: faker.datatype.uuid(),
    status: VONAGE_VERIFICATION_STATUS.SUCCESS,
    number: verification.input,
    price: faker.commerce.price(),
    currency: "USD",
    sender_id: faker.datatype.uuid(),
    date_submitted: verification.created_at,
    date_finalized: verification.updated_at,
    first_event_date: verification.created_at,
    last_event_date: verification.updated_at,
    checks: [
      {
        date_received: verification.updated_at,
        code: "123456",
        status: "VALID",
        ip_address: faker.internet.ip(),
      },
    ],
    events: [
      {
        type: "sms",
        id: faker.datatype.uuid(),
      },
    ],
    estimated_price_messages_sent: faker.commerce.price(),
  }));

exports.checkVerificationCode = jest.fn()
  .mockName("checkVerificationCode")
  .mockImplementation(async () => true);

exports.cancelVerificationRequest = jest.fn()
  .mockName("cancelVerificationRequest")
  .mockImplementation(async () => void 0);
