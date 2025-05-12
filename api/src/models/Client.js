"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("@src/constants");
const { Schema, model, Types } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: NAME.USER,
      required: true,
    },
    client_secret: {
      type: String,
      required: true,
    },
    grant_types: {
      type: [String],
      required: true,
    },
    redirect_uris: {
      type: [String],
      required: true,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    collection: COLLECTION.CLIENT,
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
   * @returns {{grant_types: string[], redirect_uris: string[]}}
   */
  serialize(client) {
    const { grant_types, redirect_uris } = client;

    return {
      grant_types,
      redirect_uris,
    };
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize client object.
   *
   * @memberOf SCHEMA.prototype
   * @returns {{grant_types: string[], redirect_uris: string[]}}
   */
  serialize() {
    return MODEL.serialize(this);
  },
});

// ------------------------- Relations --------------------------

SCHEMA.virtual("tokens", {
  ref: NAME.TOKEN,
  localField: "_id",
  foreignField: "client",
  justOne: false,
});

// ------------------------- Settings ---------------------------

SCHEMA.set("toJSON", {
  /**
   * Serialize client object.
   *
   * @param {SCHEMA} doc
   * @returns {{grant_types: string[], redirect_uris: string[]}}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.CLIENT, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
