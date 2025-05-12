"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS, WAITING_LIST_STATUS, WAITING_LIST_IDENTIFICATION_TYPE, } = require("@src/constants");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      first: {
        type: String,
        required: true,
      },
      middle: {
        type: String,
      },
      last: {
        type: String,
        required: true,
      },
    },
    address: {
      city: {
        type: String,
        required: true
      },
      pin_code: {
        type: String,
        required: true
      },
      full_address: {
        type: String,
        required: true,
      }
    },
    country_code: {
      type: String,
      required: true,
    },
    identification_type: {
      type: String,
      enum: Object.values(WAITING_LIST_IDENTIFICATION_TYPE),
    },
    identification_url: {
      front: {
        type: String,
      },
      back: {
        type: String,
      },
    },
    photo_url: {
      type: String,
    },
    terms_and_conditions_consent: {
      type: Boolean,
      required: true,
    },
    privacy_policy_consent: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(WAITING_LIST_STATUS),
      default: WAITING_LIST_STATUS.PENDING,
      required: true,
    },
    response_message: {
      type: String,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    collection: COLLECTION.WAITING_LIST_USERS,
    timestamps: TIMESTAMPS,
  },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Returns fields that can be selected by query parameters.
   *
   * @returns {string[]}
   */
  getSelectableFields() {
    return [
      "id",
      "created_at",
      "updated_at",
      "status",
      "email",
      "name",
      "address",
      "photo_url",
      "identification_url",
      "country_code"
    ];
  },
});


// ------------------------- Methods ----------------------------

// ------------------------- Relations --------------------------

SCHEMA.virtual("country", {
  ref: NAME.COUNTRY,
  localField: "country_code",
  foreignField: "code",
  justOne: true,
});

// ------------------------- Settings ---------------------------

// ------------------------- Model ------------------------------

const MODEL = model(NAME.WAITING_LIST_USERS, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------