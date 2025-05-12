"use strict";

const path = require("path");

const KEY_DIRECTORY = path.resolve(__dirname, "..", "..", "keys");

const OIDC_ADAPTER_MODEL = {
  GRANT: "Grant",
  SESSION: "Session",
  ACCESS_TOKEN: "AccessToken",
  AUTHORIZATION_CODE: "AuthorizationCode",
  REFRESH_TOKEN: "RefreshToken",
  CLIENT_CREDENTIALS: "ClientCredentials",
  CLIENT: "Client",
  INITIAL_ACCESS_TOKEN: "InitialAccessToken",
  REGISTRATION_ACCESS_TOKEN: "RegistrationAccessToken",
  DEVICE_CODE: "DeviceCode",
  INTERACTION: "Interaction",
  RELAY_DETECTION: "ReplayDetection",
  PUSHED_AUTHORIZATION_REQUEST: "PushedAuthorizationRequest",
};

const OIDC_GRANT_TYPE = {
  IMPLICIT: "implicit",
  AUTHORIZATION_CODE: "authorization_code",
  REFRESH_TOKEN: "refresh_token",
  DEVICE_CODE: "device_code",
};

const OIDC_SCOPE = {
  PROFILE: "profile",
  EMAIL: "email",
  PHONE_NUMBER: "phone_number",
};

const OIDC_CLAIM = {
  NAME: "name",
  BIRTHDATE: "birthdate",
  GENDER: "gender",
  EMAIL: "email",
  PHONE_NUMBER: "phone_number",
  PHONE_NUMBER_VERIFIED: "phone_number_verified",
};

const OIDC_SCOPED_CLAIMS = {
  [OIDC_SCOPE.PROFILE]: [OIDC_CLAIM.NAME, OIDC_CLAIM.BIRTHDATE, OIDC_CLAIM.GENDER],
  [OIDC_SCOPE.EMAIL]: [OIDC_CLAIM.EMAIL],
  [OIDC_SCOPE.PHONE_NUMBER]: [OIDC_CLAIM.PHONE_NUMBER, OIDC_CLAIM.PHONE_NUMBER_VERIFIED],
};

module.exports = {
  KEY_DIRECTORY,
  OIDC_ADAPTER_MODEL,
  OIDC_GRANT_TYPE,
  OIDC_CLAIM,
  OIDC_SCOPE,
  OIDC_SCOPED_CLAIMS,
};
