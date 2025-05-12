"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS, OIDC_ADAPTER_MODEL } = require("@src/constants");
const { Schema, model, Types } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
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
    client_id: {
      type: String,
      required: true,
    },
    jti: {
      type: String,
      required: true,
    },
    openid: {
      type: {
        scopes: {
          type: [String],
          required: true,
        },
        claims: {
          type: [String],
        },
      },
    },
    resources: {
      type: Object,
    },
    rejected: {
      type: {
        openid: {
          type: {
            scopes: {
              type: [String],
              required: true,
            },
            claims: {
              type: [String],
            },
          },
        },
        resources: {
          type: Object,
        },
      },
    },
  },
  {
    collection: COLLECTION.OAUTH_GRANT,
    timestamps: TIMESTAMPS,
  },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize client object.
   *
   * @memberOf MODEL
   * @param {Object} client
   * @returns {Object}
   */
  serialize(client) {
    const {
      issued_at,
      expires_at,
      account_id,
      client_id,
      jti,
      openid,
      resources,
      rejected,
    } = client;

    const serialized = {
      iat: issued_at.getTime() / 1000,
      exp: expires_at.getTime() / 1000,
      accountId: account_id.toString(),
      clientId: client_id,
      kind: OIDC_ADAPTER_MODEL.GRANT,
      jti,
    };

    if (openid != null) {
      serialized.openid = {};

      if (openid.scopes != null) serialized.openid.scope = openid.scopes.join(" ");
      if (openid.claims != null) serialized.openid.claims = openid.claims;
    }

    if (resources != null) serialized.resources = resources;
    if (rejected != null) {
      serialized.rejected = {};

      if (rejected.openid != null) {
        serialized.rejected.openid = {
          scope: rejected.openid.scopes.join(" "),
        };

        if (rejected.openid.claims != null) serialized.rejected.openid.claims = rejected.openid.claims;
      }

      if (rejected.resources != null) serialized.rejected.resources = rejected.resources;
    }

    return serialized;
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize client object.
   *
   * @memberOf SCHEMA.prototype
   * @returns {Object}
   */
  serialize() {
    return MODEL.serialize(this);
  },
});

// ------------------------- Relations --------------------------

// ------------------------- Settings ---------------------------

SCHEMA.set("toJSON", {
  /**
   * Serialize client object.
   *
   * @param {SCHEMA} doc
   * @returns {Object}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.OAUTH_GRANT, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
