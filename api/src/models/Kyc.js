"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS, KYC_STATUS, KYC_IDENTIFICATION_TYPE } = require("@src/constants");
const { Schema, model, Types } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: NAME.USER,
      required: true,
      unique: true,
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
    address :{
      city: {
        type : String,
        required : true
      },
      pin_code : {
        type : String,
        required : true
      },
      full_address: {
        type : String,
        required : true,
      }
    },
    country_code: {
      type: String,
      required: true,
    },
    identification_type: {
      type: String,
      required: true,
      enum: Object.values(KYC_IDENTIFICATION_TYPE),
    },
    identification_url: {
      front: {
        type: String,
        required: true,
      },
      back: {
        type: String,
      },
    },
    photo_url: {
      type: String,
      required: true,
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
      enum: Object.values(KYC_STATUS),
      default: KYC_STATUS.PENDING,
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
    collection: COLLECTION.KYC,
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
    return ["id", "created_at", "updated_at"];
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

const MODEL = model(NAME.KYC, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------