"use strict";

const {
  MODEL: NAME,
  COLLECTION,
  TIMESTAMPS,
  VERIFICATION_KIND,
  VERIFICATION_STATUS,
  DISCRIMINATOR,
} = require("@src/constants");
const { Schema, model, Types } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    [DISCRIMINATOR]: {
      type: String,
      enum: Object.values(VERIFICATION_KIND),
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: NAME.USER,
      required: true,
    },
    platform_id: {
      type: String,
    },
    input: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
      required: true,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    collection: COLLECTION.VERIFICATION,
    timestamps: TIMESTAMPS,
    discriminatorKey: DISCRIMINATOR,
  },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize user object.
   *
   * @memberOf MODEL
   * @param {Object} verification
   * @returns {Object}
   */
  serialize(verification) {
    const { id, user, input_type, input, status } = verification;

    const serialized = {
      id,
      user,
      input_type,
      input,
      status,
    };

    return serialized;
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize user object.
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
   * Serialize user object.
   *
   * @param {SCHEMA} doc
   * @returns {Object}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.VERIFICATION, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
