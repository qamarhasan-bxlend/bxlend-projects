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
    jti: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    account_id: {
      type: Types.ObjectId,
      ref: NAME.USER,
      required: true,
    },
    logged_in_at: {
      type: Date,
      required: true,
    },
    authorizations: {
      type: Object,
    },
    acr: {
      type: String,
    },
    amr: {
      type: [String],
    },
    transient: {
      type: Boolean,
    },
    state: {
      type: Object,
    },
  },
  {
    collection: COLLECTION.OAUTH_SESSION,
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
      jti,
      uid,
      account_id,
      logged_in_at,
      authorizations,
      acr,
      amr,
      transient,
      state,
    } = client;
    
    const serialized = {
      iat: issued_at.getTime() / 1000,
      exp: expires_at.getTime() / 1000,
      kind: OIDC_ADAPTER_MODEL.SESSION,
      jti,
      uid,
      accountId: account_id.toString(),
      loginTs: logged_in_at.getTime() / 1000,
    };
    
    if (authorizations != null) serialized.authorizations = authorizations;
    if (acr != null) serialized.acr = acr;
    if (amr != null) serialized.amr = amr;
    if (transient != null) serialized.transient = transient;
    if (state != null) serialized.state = state;

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

const MODEL = model(NAME.OAUTH_SESSION, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
