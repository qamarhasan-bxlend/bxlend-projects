"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS, SETTING } = require("@src/constants");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: Object.values(SETTING),
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    collection: COLLECTION.SETTING,
    timestamps: TIMESTAMPS,
  },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize setting object.
   *
   * @memberOf MODEL
   * @param {Object} setting
   * @returns {Object}
   */
  serialize(setting) {
    const { id, name, value, created_at, updated_at } = setting;

    const serialized = {
      id,
      name,
      value,
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
    return ["id", "name", "value", "created_at", "updated_at"];
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize setting object.
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
   * Serialize setting object.
   *
   * @param {SCHEMA} doc
   * @returns {Object}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.SETTING, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * tags:
 *   name: setting_model
 *   x-displayName: The Setting Model
 *   description: |
 *     <SchemaDefinition schemaRef="#/definitions/Setting" showReadOnly={true} showWriteOnly={true} />
 *
 * definitions:
 *   Setting:
 *     allOf:
 *       - $ref: "#/definitions/DBDocument"
 *       - type: object
 *         required:
 *           - name
 *           - value
 *         properties:
 *           name:
 *             description: Setting name
 *             type: string
 *             example: taker-fee
 *           value:
 *             description: Setting value
 *             type: any
 *             example: 0.01
 *
 * parameters:
 *   setting_id_parameter:
 *     description: The setting identifier
 *     in: path
 *     name: setting`_id
 *     required: true
 *     schema:
 *       type: string
 *       format: ObjectId
 *       example: "a1b2c3d"
 *
 */
