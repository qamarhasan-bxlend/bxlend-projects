"use strict";

const {
  RELEASE_ENV,
  API_URI,
  AUTH_URI,
  WEBSITE_CLIENT_ID,
  WEBSITE_CLIENT_SECRET,
  WEBSITE_CLIENT_REDIRECT_URI,
  ADMIN_CLIENT_ID,
  ADMIN_CLIENT_SECRET,
  ADMIN_CLIENT_REDIRECT_URI,
} = require("@src/config");
const { OIDC_SCOPED_CLAIMS, OIDC_CLAIM, OIDC_SCOPE, AUTH_SCOPE, RELEASE } = require("@src/constants");
const { User } = require("@src/models");
const { Types } = require("mongoose");
const Sentry = require("@sentry/node");
const Provider = require("oidc-provider");
const Adapter = require("./Adapter");
const jwks = require("./jwks");

const redirect_uris = [];

if (RELEASE_ENV === RELEASE.STAGING) {
  redirect_uris.push(
    "http://localhost:3000/auth/callback",
    "https://jwt.io",
  );
}

function isFirstParty(client) {
  // Implement your logic to determine if the client is a first-party client.
  // For example, you can check if the client belongs to your own application.

  // Example implementation:
  const allowedClientIds = [WEBSITE_CLIENT_ID, ADMIN_CLIENT_ID];
  return allowedClientIds.includes(client.clientId);
}

const OpenIDConnect = new Provider(AUTH_URI, {
  adapter: Adapter,
  clients: [
    {
      client_id: WEBSITE_CLIENT_ID,
      client_secret: WEBSITE_CLIENT_SECRET,
      client_name: "btcex-web",
      application_type: "web",
      grant_types: [
        // "implicit",
        "refresh_token",
        "authorization_code",
      ],
      response_types: [
        // "id_token",
        // "id_token token",
        "code",
      ],
      redirect_uris: [
        WEBSITE_CLIENT_REDIRECT_URI,
        ...redirect_uris,
      ],
      token_endpoint_auth_method: "client_secret_basic",
    },
    {
      client_id: ADMIN_CLIENT_ID,
      client_secret: ADMIN_CLIENT_SECRET,
      client_name: "btcex-admin",
      application_type: "web",
      grant_types: [
        // "implicit",
        "refresh_token",
        "authorization_code",
      ],
      response_types: [
        // "id_token",
        // "id_token token",
        "code",
      ],
      redirect_uris: [
        ADMIN_CLIENT_REDIRECT_URI,
        ...redirect_uris,
      ],
      token_endpoint_auth_method: "client_secret_basic",
    },
  ],
  /**
   *
   * @param ctx - koa request context
   * @param {string} sub - account identifier (subject)
   * @param {string=} token - is a reference to the token used for which a given account is being loaded,
   * is undefined in scenarios where claims are returned from authorization endpoint
   * @returns {Promise<Object|null>}
   */
  async findAccount(ctx, sub) {
    const user = await User.findOne({
      _id: Types.ObjectId(sub),
      deleted_at: { $exists: false },
    });

    if (user == null) return null;

    return {
      accountId: sub,
      /**
       *
       * @param {string} use - can either be "id_token" or "userinfo", depending on
       * where the specific claims are intended to be put in
       * @param {string} scope - the intended scope, while oidc-provider will mask
       * claims depending on the scope automatically you might want to skip
       * loading some claims from external resources or through db projection etc. based on this
       * detail or not return them in ID Tokens but only UserInfo and so on
       * @param {Object} claims - the part of the claims authorization parameter for either
       * "id_token" or "userinfo" (depends on the "use" param)
       * @param {string[]} rejected - claim names that were rejected by the end-user, you might
       * want to skip loading some claims from external resources or through db projection
       * @returns {Promise<Object>}
       */
      async claims() {
        return { sub };
      },
    };
  },
  // async loadExistingGrant(ctx) {
  //   const grantId = (ctx.oidc.result
  //     && ctx.oidc.result.consent
  //     && ctx.oidc.result.consent.grantId) || ctx.oidc.session.grantIdFor(ctx.oidc.client.clientId);

  //   if (grantId) {
  //     // keep grant expiry aligned with session expiry
  //     // to prevent consent prompt being requested when grant expires
  //     const grant = await ctx.oidc.provider.Grant.find(grantId);
  //     // console.log("here", grant)
  //     // this aligns the Grant ttl with that of the current session
  //     // if the same Grant is used for multiple sessions, or is set
  //     // to never expire, you probably do not want this in your code
  //     if (ctx.oidc.account && grant.exp < ctx.oidc.session.exp) {
  //       grant.exp = ctx.oidc.session.exp;

  //       await grant.save();
  //     }

  //     return grant;
  //   } else if (isFirstParty(ctx.oidc.client)) {
  //     const grant = new ctx.oidc.provider.Grant({
  //       clientId: ctx.oidc.client.clientId,
  //       accountId: ctx.oidc.session.accountId,
  //     });

  //     grant.addOIDCScope( Object.values(OIDC_SCOPE).join(" "));
  //     grant.addOIDCClaims(Object.values(OIDC_CLAIM));
  //     grant.addResourceScope('urn:example:resource-indicator', Object.values(AUTH_SCOPE).join(" "));
      
  //     console.log(grant)
  //     await grant.save();
  //     return grant;
  //   }
  // },
  jwks: {
    keys: jwks,
  },
  features: {
    devInteractions: { enabled: false }, // defaults to true
    revocation: { enabled: true }, // defaults to false
    resourceIndicators: {
      enabled: true,
      /**
       *
       * @param ctx - koa request context
       * @param client - client making the request
       * @param {string[]} oneOf - The OP needs to select **one** of the values provided.
       * Default is that the array is provided so that the request will fail.
       * This argument is only provided when called during Authorization Code / Refresh Token / Device Code exchanges.
       * @returns {string|undefined}
       */
      defaultResource() {
        return API_URI;
      },
      /**
       *
       * @param ctx - koa request context
       * @param resourceIndicator - resource indicator value either requested or resolved by the defaultResource helper.
       * @param client - client making the request
       * @returns {Object}
       */
      getResourceServerInfo() {
        // TODO: based on client settings!
        return {
          scope: Object.values(AUTH_SCOPE).join(" "),
        };
      },
    },
  },
  claims: OIDC_SCOPED_CLAIMS,
  cookies: {
    keys: ["_interaction", "_session"],
  },
  pkce: {
    methods: ["S256"],
    required() {
      return false;
    },
  },
  ttl: {
    AccessToken: function AccessTokenTTL(ctx, token) {
      if (token.resourceServer) {
        return token.resourceServer.accessTokenTTL || 7 * 24 * 60 * 60; // 1 week in seconds
      }
      return 7 * 24 * 60 * 60; // 1 week in seconds
      // return 60 * 60 * 24 * 14; // 14 days in seconds
    },
    AuthorizationCode: 600 /* 10 minutes in seconds */,
    ClientCredentials: function ClientCredentialsTTL(ctx, token) {
      if (token.resourceServer) {
        return token.resourceServer.accessTokenTTL || 10 * 60; // 10 minutes in seconds
      }
      return 10 * 60; // 10 minutes in seconds
    },
    DeviceCode: 600 /* 10 minutes in seconds */,
    Grant: 1209600 /* 14 days in seconds */,
    IdToken: 3600 /* 1 hour in seconds */,
    Interaction: 3600 /* 1 hour in seconds */,
    RefreshToken: function RefreshTokenTTL(ctx, token, client) {
      if (
        ctx && ctx.oidc.entities.RotatedRefreshToken
        && client.applicationType === "web"
        && client.tokenEndpointAuthMethod === "none"
        && !token.isSenderConstrained()
      ) {
        // Non-Sender Constrained SPA RefreshTokens do not have infinite expiration through rotation
        return ctx.oidc.entities.RotatedRefreshToken.remainingTTL;
      }

      return 14 * 24 * 60 * 60; // 14 days in seconds
    },
    Session: 1209600, /* 14 days in seconds */
  },
  responseTypes: [
    // "id_token",
    // "id_token token",
    "code",
  ],
  // async issueRefreshToken(ctx, client, code) {
  //   if (!client.grantTypeAllowed("refresh_token")) return false;
  //
  //   return code.scopes.has("offline_access") || (client.applicationType === "web" && client.tokenEndpointAuthMethod === "none");
  // },
  interactions: {
    // TODO: temporary, remove after making auth, a separate service
    url: async function interactionsUrl(ctx, interaction) {
      const url = `/auth/interaction/${interaction.uid}`;

      // if (NODE_ENV !== ENV.PRODUCTION) return `/auth${ url }`;

      return url;
    },
  },
  // TODO:
  renderError(ctx, out, error) {
    console.log(error)
  },
});

OpenIDConnect.proxy = true;

OpenIDConnect.on("server_error", (ctx, error) => Sentry.captureException(error));

module.exports = OpenIDConnect;
