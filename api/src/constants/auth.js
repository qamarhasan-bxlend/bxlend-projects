"use strict";

const AUTH_SCOPE = {
  // User Profile
  READ_USER_PROFILE: "read:user.profile",
  WRITE_USER_PROFILE: "write:user.profile",
  REMOVE_USER: "remove:user",
  // User Password
  WRITE_USER_PASSWORD: "write:user.password",
  // User Email
  READ_USER_EMAIL: "read:user.email",
  WRITE_USER_EMAIL: "write:user.email",
  // User Phone Number
  READ_USER_PHONE_NUMBER: "read:user.phone_number",
  WRITE_USER_PHONE_NUMBER: "write:user.phone_number",
};

module.exports = {
  AUTH_SCOPE,
};
