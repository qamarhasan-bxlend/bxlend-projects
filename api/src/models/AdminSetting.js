"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("@src/constants");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description:{
      type: String,
    },
    key: {
      type: String,
      required: true,
      ref: NAME.WALLET,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION.ADMIN_SETTING,
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
    const { id, title, key, value, created_at, updated_at } = country;

    const serialized = { id, title, key, value, created_at, updated_at };

    return serialized;
  },

  /**
	 * Returns fields that can be selected by query parameters.
	 *
	 * @returns {string[]}
	 */
  getSelectableFields() {
    return ["id", "title", "description", "key", "value", "created_at", "updated_at"];
  },
});

// ------------------------- Methods ----------------------------

// ------------------------- Relations --------------------------

// ------------------------- Settings ---------------------------

// ------------------------- Model ------------------------------

const MODEL = model(NAME.ADMIN_SETTING, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 * 
 * tags:
 *   name: admin_setting_model
 *   x-displayName: The Admin Setting Model
 *   description: |
 *     <SchemaDefinition schemaRef="#/definitions/AdminSetting" showReadOnly={true} showWriteOnly={true} />
 *
 * definitions:
 *   AdminSetting:
 *     allOf:
 *       - type: object
 *         required:
 *           - title
 *           - key
 *           - value
 *         properties:
 *           title:
 *             description: Setting title
 *             type: string
 *             example: "Commition Fee Percent"
 *           description:
 *             description: Setting description
 *             type: string
 *             example: "The deducted feed from each transactions ( in percent ) as Commition fee"
 *           key:
 *             description: Setting key that is binded to System
 *             type: string
 *             example: "COMMITION_FEE"
 *           value:
 *             description: Transfer Transaction target waller
 *             type: string
 *             example: "1.245"
 * 
 * parameters:
 *   setting_id_parameter:
 *     description: Admin Setting Identifier
 *     in: path
 *     name: setting_id
 *     required: true
 *     schema:
 *       type: string
 *       format: ObjectId
 *       example: "61210f13e6c6708c4c423e4e"
 *
 */
