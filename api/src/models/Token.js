"use strict";

const {
  MODEL: NAME,
  COLLECTION,
  TIMESTAMPS,
  TOKEN_KIND,
  TOKEN_GTY,
} = require("@src/constants");
const { tokenKindToOIDCModel, tokenGtyToOIDCGrantType } = require("@src/utils");
const { Schema, model, Types } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    kind: {
      type: String,
      required: true,
      enum: Object.values(TOKEN_KIND),
    },
    issued_at: {
      type: Date,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
    account_id: {
      type: Types.ObjectId,
      ref: NAME.USER,
      required: true,
    },
    grant_id: {
      type: String,
      required: true,
    },
    nonce: {
      type: String,
      required: true,
    },
    redirect_uri: {
      type: String,
      required: true,
    },
    scopes: {
      type: [String],
      required: true,
    },
    session_uid: {
      type: String,
      required: true,
    },
    jti: {
      type: String,
      required: true,
    },
    client_id: {
      type: String,
      required: true,
    },
    expires_with_session: {
      type: Boolean,
      required: true,
    },
    gty: {
      type: String,
      enum: Object.values(TOKEN_GTY),
    },
    sid: {
      type: String,
    },
    claims: {
      type: Object,
    },
    audience: {
      type: String,
    },
    authenticated_at: {
      type: Date,
    },
    extra: {
      type: Object,
    },
    code_challenge: {
      type: String,
    },
    code_challenge_method: {
      type: String,
    },
    resources: {
      type: [String],
    },
    rotations: {
      type: Number,
    },
    initially_issued_at: {
      type: Date,
    },
    acr: {
      type: String,
    },
    amr: {
      type: [String],
    },
    // TODO: x5t#S256
    jkt: {
      type: String,
    },
    params: {
      type: Object,
    },
    user_code: {
      type: String,
    },
    device_info: {
      type: Object,
    },
    in_flight: {
      type: Boolean,
    },
    error: {
      type: String,
    },
    error_description: {
      type: String,
    },
    policies: {
      type: [String],
    },
    request: {
      type: String,
    },
    consumed_at: {
      type: Date,
    },
  },
  {
    collection: COLLECTION.TOKEN,
    timestamps: TIMESTAMPS,
  },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize token object.
   *
   * @memberOf MODEL
   * @param {Object} token
   * @returns {Object}
   */
  serialize(token) {
    const {
      kind,
      issued_at,
      expires_at,
      account_id,
      grant_id,
      nonce,
      redirect_uri,
      scopes,
      session_uid,
      jti,
      client_id,
      expires_with_session,
      gty,
      sid,
      claims,
      audience,
      authenticated_at,
      extra,
      code_challenge,
      code_challenge_method,
      resources,
      rotations,
      initially_issued_at,
      acr,
      amr,
      jkt,
      params,
      user_code,
      device_info,
      in_flight,
      error,
      error_description,
      policies,
      request,
      consumed_at,
    } = token;

    const serialized = {
      kind: tokenKindToOIDCModel(kind),
      iat: issued_at.getTime() / 1000,
      exp: expires_at.getTime() / 1000,
      accountId: account_id.toString(),
      grantId: grant_id,
      nonce,
      redirectUri: redirect_uri,
      scope: scopes.join(" "),
      sessionUid: session_uid,
      jti,
      clientId: client_id,
      expiresWithSession: expires_with_session,
    };

    if (gty != null) serialized.gty = tokenGtyToOIDCGrantType(gty);
    if (sid != null) serialized.sid = sid;
    if (claims != null) serialized.claims = claims;
    if (audience != null) serialized.audience = audience;
    if (authenticated_at != null) serialized.authTime = authenticated_at.getTime() / 1000;
    if (extra != null) serialized.extra = extra;
    if (code_challenge != null) serialized.codeChallenge = code_challenge;
    if (code_challenge_method != null) serialized.codeChallengeMethod = code_challenge_method;
    if (resources != null) serialized.resource = resources.length === 1 ? resources[0] : resources;
    if (rotations != null) serialized.rotations = rotations;
    if (initially_issued_at != null) serialized.iiat = initially_issued_at.getTime() / 1000;
    if (acr != null) serialized.acr = acr;
    if (amr != null) serialized.amr = amr;
    if (jkt != null) serialized.jkt = jkt;
    if (params != null) serialized.params = params;
    if (user_code != null) serialized.userCode = user_code;
    if (device_info != null) serialized.deviceInfo = device_info;
    if (in_flight != null) serialized.inFlight = in_flight;
    if (error != null) serialized.error = error;
    if (error_description != null) serialized.errorDescription = error_description;
    if (policies != null) serialized.policies = policies;
    if (request != null) serialized.request = request;
    if (consumed_at != null) serialized.consumed = consumed_at;

    return serialized;
  },

  /**
   * Checks whether the token has specified scopes.
   * It will return true if no scopes are passed or empty array is passed.
   *
   * @memberOf MODEL
   * @param {Object} token
   * @param {string[]=} scopes
   * @returns {boolean}
   */
  can(token, scopes = []) {
    const tokenScopes = token.scopes;

    for (const scope of scopes) {
      if (!tokenScopes.includes(scope)) return false;
    }

    return true;
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize token object.
   *
   * @memberOf SCHEMA.prototype
   * @returns {Object}
   */
  serialize() {
    return MODEL.serialize(this);
  },

  /**
   * Checks whether the token has specified scopes.
   * It will return true if no scopes are passed.
   *
   * @memberOf SCHEMA.prototype
   * @param {string} scopes
   * @returns {boolean}
   */
  can(...scopes) {
    return MODEL.can(this, scopes);
  },
});

// ------------------------- Relations --------------------------

// ------------------------- Settings ---------------------------

SCHEMA.set("toJSON", {
  /**
   * Serialize token object.
   *
   * @param {SCHEMA} doc
   * @returns {Object}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.TOKEN, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
