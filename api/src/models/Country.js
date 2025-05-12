"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("@src/constants");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone_code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION.COUNTRY,
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
    const { id, code, name, phone_code, language, created_at, updated_at } = country;

    const serialized = {
      id,
      code,
      name,
      phone_code,
      language,
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
    return ["id", "code", "name", "phone_code", "language", "currency", "created_at", "updated_at"];
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

SCHEMA.virtual("currencies", {
  ref: NAME.FIAT_CURRENCY,
  localField: "code",
  foreignField: "country_code",
  justOne: false,
});

SCHEMA.virtual("users", {
  ref: NAME.USER,
  localField: "code",
  foreignField: "country_code",
  justOne: false,
});

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

const MODEL = model(NAME.COUNTRY, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * tags:
 *   name: country_model
 *   x-displayName: The Country Model
 *   description: |
 *     <SchemaDefinition schemaRef="#/definitions/Country" showReadOnly={true} showWriteOnly={true} />
 *
 * definitions:
 *   Country:
 *     allOf:
 *       - $ref: "#/definitions/DBDocument"
 *       - type: object
 *         required:
 *           - code
 *           - name
 *           - phone_code
 *           - language
 *         properties:
 *           code:
 *             description: Country code (ISO format)
 *             type: string
 *             example: US
 *           name:
 *             description: Country name
 *             type: string
 *             example: United States
 *           phone_code:
 *             description: Country phone number code
 *             type: string
 *             example: "1"
 *           language:
 *             description: Country main language
 *             type: string
 *             example: en-US
 *
 * parameters:
 *   country_id_parameter:
 *     description: The country identifier
 *     in: path
 *     name: country_id
 *     required: true
 *     schema:
 *       type: string
 *       format: ObjectId
 *       example: "a1b2c3d"
 *
 */
