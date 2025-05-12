"use strict";

/**
 * Map token's kind value to OpenID Connect related model.
 *
 * @param {string} kind
 * @returns {string}
 */
function tokenKindToOIDCModel(kind) {
  return TOKEN_KIND_TO_OIDC_MODEL_MAP[kind];
}

/**
 * Map OpenID Connect model to token's kind value.
 *
 * @param {string} model
 * @returns {string}
 */
function OIDCModelToTokenKind(model) {
  return OIDC_MODEL_TO_TOKEN_KIND_MAP[model];
}

/**
 * Map token's gty value to OpenID Connect grant type.
 *
 * @param {string} gty
 * @returns {string}
 */
function tokenGtyToOIDCGrantType(gty) {
  return TOKEN_GTY_TO_OIDC_GRANT_TYPE_MAP[gty];
}

/**
 * Map OpenID Connect grant type to token's gty value.
 *
 * @param {string} gty
 * @returns {string}
 */
function OIDCGrantTypeToTokenGty(gty) {
  return OIDC_GRANT_TYPE_TO_TOKEN_GTY_MAP[gty];
}

module.exports = {
  tokenKindToOIDCModel,
  OIDCModelToTokenKind,
  tokenGtyToOIDCGrantType,
  OIDCGrantTypeToTokenGty,
};

const TOKEN_KIND_TO_OIDC_MODEL_MAP = {
  ACCESS_TOKEN: "AccessToken",
  AUTHORIZATION_CODE: "AuthorizationCode",
  REFRESH_TOKEN: "RefreshToken",
  CLIENT_CREDENTIALS: "ClientCredentials",
  INITIAL_ACCESS_TOKEN: "InitialAccessToken",
  REGISTRATION_ACCESS_TOKEN: "RegistrationAccessToken",
  DEVICE_CODE: "DeviceCode",
};

const OIDC_MODEL_TO_TOKEN_KIND_MAP = {
  AccessToken: "ACCESS_TOKEN",
  AuthorizationCode: "AUTHORIZATION_CODE",
  RefreshToken: "REFRESH_TOKEN",
  ClientCredentials: "CLIENT_CREDENTIALS",
  InitialAccessToken: "INITIAL_ACCESS_TOKEN",
  RegistrationAccessToken: "REGISTRATION_ACCESS_TOKEN",
  DeviceCode: "DEVICE_CODE",
};

const TOKEN_GTY_TO_OIDC_GRANT_TYPE_MAP = {
  IMPLICIT: "implicit",
  AUTHORIZATION_CODE: "authorization_code",
  REFRESH_TOKEN: "refresh_token",
  DEVICE_CODE: "device_code",
};

const OIDC_GRANT_TYPE_TO_TOKEN_GTY_MAP = {
  implicit: "IMPLICIT",
  authorization_code: "AUTHORIZATION_CODE",
  refresh_token: "REFRESH_TOKEN",
  device_code: "DEVICE_CODE",
};
