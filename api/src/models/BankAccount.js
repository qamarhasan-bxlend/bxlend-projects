"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS, BANK_ACCOUNT_STATUS } = require("@src/constants");
const { Schema, Types, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      required: true,
      ref: NAME.USER,
    },
    bank_name: {
      type: String,
      required: true,
    },
    bank_country: {
      type: Types.ObjectId,
      required: true,
      ref: NAME.COUNTRY,
    },
    account_number: {
      type: String,
      required: true,
    },
    swift_bic_code: {
      type: String,// ( A: Bank code[A-Z], B: Country code[A-Z], C: Location code [0-9A-Z], 123: Branch Code [0-9A-Z] )
      required: true,
    },
    currency: {
      type: Types.ObjectId,
      required: true,
      ref: NAME.FIAT_CURRENCY,
    },
    reviews: {
      type: [{
        status: {
          type: String,
          required: true,
          enum: Object.values(BANK_ACCOUNT_STATUS),
        },
        reviewer: {
          type: Types.ObjectId,
          required: true,
          ref: NAME.USER,
          default: null,
        },
        timestamp: {
          type: Date,
          required: true,
          default: null,
        },
      }],
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(BANK_ACCOUNT_STATUS),
      default: BANK_ACCOUNT_STATUS.UNDER_REVIEW,
    },
    deleted_at:{
      type: Date,
    },
  },
  {
    collection: COLLECTION.BANK_ACCOUNT,
    timestamps: TIMESTAMPS,
  },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
	 * Serialize country object.
	 *
	 * @memberOf MODEL
	 * @param {Object} country
	 * @returns {Object}
	 */
  serialize(country) {
    const {
      id,
      owner,
      bank_name,
      bank_country,
      currency,
      account_number,
      swift_bic_code,
      reviews,
      status,
      created_at,
      updated_at,
    } = country;

    const serialized = {
      id,
      owner,
      bank_name,
      bank_country,
      currency,
      account_number,
      swift_bic_code,
      reviews,
      status,
      created_at,
      updated_at,
    };

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
      "owner",
      "bank_name",
      "bank_country",
      "currency",
      "account_number",
      "swift_bic_code",
      "reviews",
      "status",
      "created_at",
      "updated_at",
    ];
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
	 * Serialize country object.
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
	 * Serialize country object.
	 *
	 * @param {SCHEMA} doc
	 * @returns {Object}
	 */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.BANK_ACCOUNT, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * tags:
 *   name: bank_account_model
 *   x-displayName: The Bank Account Model
 *   description: |
 *     <SchemaDefinition schemaRef="#/definitions/BankAccount" showReadOnly={true} showWriteOnly={true} />
 *
 * definitions:
 *   BankAccount:
 *     allOf:
 *       - $ref: "#/definitions/DBDocument"
 *       - type: object
 *         required:
 *           - owner
 *           - bank_name
 *           - bank_country
 *           - account_number
 *           - swift_bic_code
 *           - currency
 *           - status
 *         properties:
 *           owner:
 *             description: Bank Account owner ID
 *             type: string
 *             example: 61210ef402fd169cfe70d545
 *           bank_name:
 *             description: Bank Name
 *             type: string
 *             example: National Bank of the Hong Kong
 *           bank_country:
 *             description: Bank located country ID
 *             type: string
 *             example: 61210f00ac8dccc57c18e10c
 *           account_number:
 *             description: Bank Account number
 *             type: string
 *             example: 1001001234
 *           swift_bic_code:
 *             description: Swift/BIC code
 *             type: string
 *             example: AAAABBCC123
 *           currency:
 *             description: Currency ID
 *             type: string
 *             example: 61210f07b3b446091f309797
 *           reviews:
 *             description: Admin review logs placed on this Bank Account
 *             type: array
 *             items:
 *               properties:
 *                 status:
 *                   description: Current status of this Review
 *                   type: string
 *                   enum:
 *                     - VERIFIED
 *                     - SUSPENDED
 *                     - REJECTED
 *                     - UNDER_REVIEW
 *                   example: SUSPENDED
 *                 reviewer:
 *                   description: Reviewer admin ID
 *                   type: string
 *                   example: 61210f07b3b446091f309797
 *                 timestamp:
 *                   description: Current reviewed datetime
 *                   type: string
 *                   example: 2021-08-21T16:37:15.090Z
 *             example:
 *               - status: REJECTED
 *                 reviewer: 61210f07b3b446091f309797
 *                 timestamp: 2021-08-21T16:37:15.090Z
 *              
 *           status:
 *             description: Current status of this Bank Account
 *             type: string
 *             enum:
 *               - VERIFIED
 *               - SUSPENDED
 *               - REJECTED
 *               - UNDER_REVIEW
 *             example: REJECTED
 *
 * parameters:
 *   bank_account_id_parameter:
 *     description: Bank Account Identifier
 *     in: path
 *     name: bank_account_id
 *     required: true
 *     schema:
 *       type: string
 *       format: ObjectId
 *       example: "61210f13e6c6708c4c423e4e"
 *
 */