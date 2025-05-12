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
    return_to: {
      type: String,
      required: true,
    },
    prompt: {
      type: Object,
    },
    params: {
      type: Object,
      required: true,
    },
    jti: {
      type: String,
      required: true,
    },
    last_submission: {
      type: Object,
    },
    trusted: {
      type: [String],
    },
    result: {
      type: Object,
    },
    grant_id: {
      type: String,
    },
    session: {
      type: {
        uid: {
          type: String,
          required: true,
        },
        cookie: {
          type: String,
          required: true,
        },
        acr: {
          type: String,
        },
        amr: {
          type: [String],
        },
        account_id: {
          type: Types.ObjectId,
          ref: NAME.USER,
          required: true,
        },
      },
    },
  },
  {
    collection: COLLECTION.OAUTH_INTERACTION,
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
      return_to,
      prompt,
      params,
      jti,
      last_submission,
      trusted,
      result,
      grant_id,
      session,
    } = client;

    const serialized = {
      iat: issued_at.getTime() / 1000,
      exp: expires_at.getTime() / 1000,
      returnTo: return_to,
      params,
      kind: OIDC_ADAPTER_MODEL.INTERACTION,
      jti,
    };

    if (prompt != null) serialized.prompt = prompt;
    if (last_submission != null) serialized.lastSubmission = last_submission;
    if (trusted != null) serialized.trusted = trusted;
    if (result != null) serialized.result = result;
    if (grant_id != null) serialized.grantId = grant_id;
    if (session != null) {
      serialized.session = {
        uid: session.uid,
        cookie: session.cookie,
        accountId: session.account_id?.toString(),
      };

      if (session.acr != null) serialized.session.acr = session.acr;
      if (session.amr != null) serialized.session.amr = session.amr;
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

const MODEL = model(NAME.OAUTH_INTERACTION, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
