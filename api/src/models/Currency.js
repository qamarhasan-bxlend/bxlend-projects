"use strict";

const {
  MODEL: NAME,
  COLLECTION,
  TIMESTAMPS,
  DISCRIMINATOR,
  CURRENCY_KIND,
} = require("@src/constants");
const { generateAssetUri } = require("@src/utils");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    [DISCRIMINATOR]: {
      type: String,
      enum: Object.values(CURRENCY_KIND),
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    display_decimals: {
      type: Number,
      min: 0,
      default: 2,
      required: true,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    collection: COLLECTION.CURRENCY,
    timestamps: TIMESTAMPS,
    discriminatorKey: DISCRIMINATOR,
  }
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize currency object.
   *
   * @memberOf MODEL
   * @param {Object} currency
   * @returns {Object}
   */
  serialize(currency) {
    const { id, kind, code, name, display_decimals, created_at, updated_at } =
      currency;

    const serialized = {
      id,
      kind,
      code,
      name,
      display_decimals,
    };

    switch (kind) {
      case CURRENCY_KIND.FIAT:
        serialized.symbol = currency.symbol;
        serialized.country = currency.country ?? currency.country_code;
        break;
      case CURRENCY_KIND.CRYPTO:
        serialized.decimals = currency.decimals;
        serialized.icon = currency.icon;
        serialized.website = currency.website;
        // serialized.networks = currency.networks;
        serialized.supported_blockchains = currency.supported_blockchains.map(b => ({
          blockchain: b.blockchain,
          contract_address: b.contract_address,
          withdrawal_options: b.withdrawal_options,
          deposit_options: b.deposit_options
        }));
        break;
        
      default:
        throw new Error(`Unexpected currency kind: ${kind}`);
    }

    serialized.created_at = created_at;
    serialized.updated_at = updated_at;

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
      "kind",
      "code",
      "name",
      "display_decimals",
      "created_at",
      "updated_at",
    ];
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize currency object.
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
   * Serialize currency object.
   *
   * @param {SCHEMA} doc
   * @returns {Object}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.CURRENCY, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * tags:
 *   name: currency_model
 *   x-displayName: The Currency Model
 *   description: |
 *     <SchemaDefinition schemaRef="#/definitions/Currency" showReadOnly={true} showWriteOnly={true} />
 *
 * definitions:
 *   Currency:
 *     allOf:
 *       - $ref: "#/definitions/DBDocument"
 *       - type: object
 *         discriminator:
 *           propertyName: kind
 *           mapping:
 *             CRYPTO: "#/definitions/CryptoCurrency"
 *             FIAT: "#/definitions/FiatCurrency"
 *         required:
 *           - kind
 *           - code
 *           - name
 *           - display_decimals
 *         properties:
 *           kind:
 *             description: Currency kind
 *             type: string
 *             enum:
 *               - CRYPTO
 *               - FIAT
 *           code:
 *             description: Currency code
 *             type: string
 *             example: USD
 *           name:
 *             description: Currency name
 *             type: string
 *             example: United States Dollar
 *           display_decimals:
 *             description: Currency decimals to be used for views
 *             type: integer
 *             example: 2
 *
 * parameters:
 *   currency_id_parameter:
 *     description: The currency identifier
 *     in: path
 *     name: currency_id
 *     required: true
 *     schema:
 *       type: string
 *       format: ObjectId
 *       example: "a1b2c3d"
 *
 */
