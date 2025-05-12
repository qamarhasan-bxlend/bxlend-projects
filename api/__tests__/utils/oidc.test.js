"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

describe("tokenKindToOIDCModel", () => {
  it("should map token's kind value to OpenID Connect related model", async () => {
    const { TOKEN_KIND, OIDC_ADAPTER_MODEL } = require("@src/constants");
    const { tokenKindToOIDCModel } = require("@src/utils");

    for (const key in TOKEN_KIND) {
      expect(tokenKindToOIDCModel(TOKEN_KIND[key])).toEqual(OIDC_ADAPTER_MODEL[key]);
    }
  });

  it("should return undefined it unknown token kind is passed", async () => {
    const { tokenKindToOIDCModel } = require("@src/utils");

    expect(tokenKindToOIDCModel("something")).toBeUndefined();
  });
});

describe("OIDCModelToTokenKind", () => {
  it("should map OpenID Connect model to token's kind value", async () => {
    const { TOKEN_KIND, OIDC_ADAPTER_MODEL } = require("@src/constants");
    const { OIDCModelToTokenKind } = require("@src/utils");

    for (const key in OIDC_ADAPTER_MODEL) {
      expect(OIDCModelToTokenKind(OIDC_ADAPTER_MODEL[key])).toEqual(TOKEN_KIND[key]);
    }
  });

  it("should return undefined it unknown OpenID Connect model is passed", async () => {
    const { OIDCModelToTokenKind } = require("@src/utils");

    expect(OIDCModelToTokenKind("something")).toBeUndefined();
  });
});

describe("tokenGtyToOIDCGrantType", () => {
  it("should map token's gty value to OpenID Connect grant type", async () => {
    const { TOKEN_GTY, OIDC_GRANT_TYPE } = require("@src/constants");
    const { tokenGtyToOIDCGrantType } = require("@src/utils");

    for (const key in TOKEN_GTY) {
      expect(tokenGtyToOIDCGrantType(TOKEN_GTY[key])).toEqual(OIDC_GRANT_TYPE[key]);
    }
  });

  it("should return undefined it unknown token gty is passed", async () => {
    const { tokenGtyToOIDCGrantType } = require("@src/utils");

    expect(tokenGtyToOIDCGrantType("something")).toBeUndefined();
  });
});

describe("OIDCGrantTypeToTokenGty", () => {
  it("should map OpenID Connect grant type to token's gty value", async () => {
    const { TOKEN_GTY, OIDC_GRANT_TYPE } = require("@src/constants");
    const { OIDCGrantTypeToTokenGty } = require("@src/utils");

    for (const key in OIDC_GRANT_TYPE) {
      expect(OIDCGrantTypeToTokenGty(OIDC_GRANT_TYPE[key])).toEqual(TOKEN_GTY[key]);
    }
  });

  it("should return undefined it unknown OpenID Connect grant type is passed", async () => {
    const { OIDCGrantTypeToTokenGty } = require("@src/utils");

    expect(OIDCGrantTypeToTokenGty("something")).toBeUndefined();
  });
});
