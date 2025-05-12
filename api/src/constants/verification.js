"use strict";

const VERIFICATION_KIND = {
  VONAGE_PHONE_NUMBER: "VONAGE_PHONE_NUMBER",
  MAILGUN_EMAIL: "MAILGUN_EMAIL",
  TWILIO_PHONE_NUMBER : "TWILIO_PHONE_NUMBER"
};

const VERIFICATION_INPUT_TYPE = {
  PHONE_NUMBER: "phone_number",
  EMAIL: "email",
  WAITING_LIST_USERS: "waiting_list_users"
};

const VERIFICATION_PLATFORM = {
  VONAGE: "Vonage",
  MAILGUN: "Mailgun",
  TWILIO : "Twilio"
};

const VERIFICATION_STATUS = {
  PENDING: "pending",
  DELIVERED: "delivered",
  VERIFIED: "verified",
  CANCELED: "canceled",
  FAILED: "failed",
  EXPIRED: "expired",
};

module.exports = {
  VERIFICATION_KIND,
  VERIFICATION_INPUT_TYPE,
  VERIFICATION_PLATFORM,
  VERIFICATION_STATUS,
};
