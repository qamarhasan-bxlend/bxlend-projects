"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS, USER_GENDER, USER_STATUS, AUTH_SCOPE, KYC_STATUS } = require("@src/constants");
const { Schema, model, Types } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      required: true
    },
    twoFA_verified: {
      type: Boolean,
      default: false
    },
    name: {
      first: {
        type: String,
      },
      last: {
        type: String,
      },
    },
    birthdate: {
      type: Date,
    },
    gender: {
      type: String,
      enum: Object.values(USER_GENDER),
    },
    country_code: {
      type: String,
    },
    language: {
      type: String,
    },
    email_verified_at: {
      type: Date,
    },
    phone_number: {
      number : {
        type: String,
      },
      code : {
        type: String,
      }
    },
    phone_number_verified_at: {
      type: Date,
    },
    referred_by: {
      type : String,
      required: false // bxlend ID of the user who referred this user,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    kyc_status: {
      type: String,
      enum: Object.values(KYC_STATUS),
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    deleted_at: {
      type: Date,
    },
    favorite_currencyPairs: {
      type: [Types.ObjectId]
    },
    bxlend_id:{
      type: String,
      unique: true
    }
  },
  {
    collection: COLLECTION.USER,
    timestamps: TIMESTAMPS,
  },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize user object.
   *
   * @memberOf MODEL
   * @param {Object} user
   * @param {import("mongoose").Document=} token
   * @returns {Object}
   */
  serialize(user, token = { can: () => true }) {
    const {
      id,
      email,
      name,
      birthdate,
      gender,
      country,
      language,
      phone_number,
      referred_by,
      email_verified_at,
      twoFA_verified,
      phone_number_verified_at,
      kyc_status,
      status,
      bxlend_id,
      favorite_currencyPairs,
      created_at,
      updated_at,
    } = user;

    const serialized = {
      id,
    };

    if (token.can(AUTH_SCOPE.READ_USER_EMAIL)) {
      serialized.email = email;
      serialized.email_verified = email_verified_at != null;
    }

    if (token.can(AUTH_SCOPE.READ_USER_PROFILE)) {
      if (name != null) serialized.name = name;
      if (birthdate != null) serialized.birthdate = birthdate;
      if (gender != null) serialized.gender = gender;
      if (country != null) serialized.country = country;
      if (language != null) serialized.language = language;
      if(phone_number != null) serialized.phone_number = phone_number;
      if (phone_number_verified_at != null) serialized.phone_number_verified = phone_number_verified_at != null;
    }

    if (token.can(AUTH_SCOPE.READ_USER_PHONE_NUMBER) && phone_number != null) {
      serialized.phone_number = phone_number;
      serialized.phone_number_verified = phone_number_verified_at != null;
    }

    serialized.kyc_status = kyc_status;
    serialized.referred_by = referred_by;
    serialized.favorite_currencyPairs = favorite_currencyPairs;
    serialized.status = status;
    serialized.bxlend_id = bxlend_id;

    //TODO: Add status to serialization
    serialized.created_at = created_at;
    serialized.updated_at = updated_at;
    serialized.twoFA_verified = twoFA_verified;
    serialized.phone_number_verified = phone_number_verified_at != null;
 

    return serialized;
  },
  /**
   * Returns fields that can be selected by query parameters.
   *
   * @returns {string[]}
   */
  getSelectableFields() {
    return [
      "id",
      "email",
      "name",
      "birthdate",
      "gender",
      "quantity",
      "country_code",
      "referred_by",
      "bxlend_id",
      "language",
      "email_verified_at",
      "twoFA_verified",
      "phone_number",
      "phone_number_verified_at",
      "status",
      "kyc_status",
      "favorite_currencyPairs",
      "created_at",
      "updated_at",
    ];
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize user object.
   *
   * @memberOf SCHEMA.prototype
   * @param {import("mongoose").Document=} token
   * @returns {Object}
   */
  serialize(token = undefined) {
    return MODEL.serialize(this, token);
  },
});

// ------------------------- Relations --------------------------

SCHEMA.virtual("country", {
  ref: NAME.COUNTRY,
  localField: "country_code",
  foreignField: "code",
  justOne: true,
});

SCHEMA.virtual("clients", {
  ref: NAME.CLIENT,
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

SCHEMA.virtual("tokens", {
  ref: NAME.TOKEN,
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

SCHEMA.virtual("verifications", {
  ref: NAME.VERIFICATION,
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

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

const MODEL = model(NAME.USER, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * tags:
 *   name: user_model
 *   x-displayName: The User Model
 *   description: |
 *     <SchemaDefinition schemaRef="#/definitions/User" showReadOnly={true} showWriteOnly={true} />
 *
 * definitions:
 *   User:
 *     allOf:
 *       - $ref: "#/definitions/DBDocument"
 *       - type: object
 *         required:
 *           - email
 *           - email_verified
 *           - phone_number_verified
 *         properties:
 *           email:
 *             description: "User's email address"
 *             type: string
 *             format: email
 *             readOnly: true
 *             example: "developers@btcex.pro"
 *           email_verified:
 *             description: "Indicates whether the email is verified or not"
 *             type: boolean
 *             readOnly: true
 *             example: true
 *           name:
 *             description: "User's name"
 *             type: object
 *             properties:
 *               first:
 *                 description: "User's first name"
 *                 type: string
 *                 example: "Ardalan"
 *               last:
 *                 description: "User's last name"
 *                 type: string
 *                 nullable: true
 *                 example: "Amini"
 *           birthdate:
 *             description: "User's birthdate"
 *             type: string
 *             format: date
 *             nullable: true
 *             example: "2021-01-01"
 *           gender:
 *             description: "User's gender"
 *             type: string
 *             enum:
 *               - FEMALE
 *               - MALE
 *             nullable: true
 *             example: "MALE"
 *           country:
 *             description: Country code (ISO format)
 *             type: string
 *             nullable: true
 *             example: US
 *           language:
 *             description: User preferred language
 *             type: string
 *             nullable: true
 *             example: en-US
 *           phone_number:
 *             description: "User's phone number"
 *             type: string
 *             format: phone_number
 *             nullable: true
 *             readOnly: true
 *             example: "+12133734253"
 *           phone_number_verified:
 *             description: "Indicates whether the phone number is verified or not"
 *             type: boolean
 *             readOnly: true
 *             example: true
 *           status:
 *             description: User's status in suspention situations
 *             type: string
 *             enum:
 *               - SUSPENDED
 *               - ACTIVE
 *             example: SUSPENDED
 *
 * parameters:
 *   user_id_parameter:
 *     description: "The user identifier (`me` can be used for logged in users)"
 *     in: path
 *     name: user_id
 *     required: true
 *     schema:
 *       type: string
 *       format: ObjectId
 *       example: "a1b2c3d"
 *
 */
