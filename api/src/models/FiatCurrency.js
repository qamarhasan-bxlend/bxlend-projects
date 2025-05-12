"use strict";

const { MODEL: NAME, CURRENCY_KIND, DISCRIMINATOR } = require("@src/constants");
const { Schema } = require("mongoose");
const Currency = require("./Currency");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    /**
     * Fiat currency symbol
     *
     * @example "$"
     */
    symbol: {
      type: String,
      required: true,
    },
    /**
     * Refers to the country governing the currency
     *
     * @example "US"
     */
    country_code: {
      type: String,
      required: true,
    },
  },
  {
    discriminatorKey: DISCRIMINATOR,
  },
);

// ------------------------- Statics ----------------------------

// ------------------------- Methods ----------------------------

// ------------------------- Relations --------------------------

SCHEMA.virtual("country", {
  ref: NAME.COUNTRY,
  localField: "country_code",
  foreignField: "code",
  justOne: true,
});

SCHEMA.static({
  /**
   * Returns fields that can be selected by query parameters.
   *
   * @returns {string[]}
   */
  getSelectableFields() {
    return [
      "id",
      "kind",          // Inherited from Currency
      "code",          // Inherited from Currency
      "name",          // Inherited from Currency
      "symbol",        // Specific to Fiat
      "country_code",  // Specific to Fiat
      "created_at",    // Inherited from Currency
      "updated_at",    // Inherited from Currency
    ];
  },
});


// ------------------------- Settings ---------------------------

// ------------------------- Model ------------------------------

const MODEL = Currency.discriminator(NAME.FIAT_CURRENCY, SCHEMA, CURRENCY_KIND.FIAT);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   FiatCurrency:
 *     allOf:
 *       - $ref: "#/definitions/Currency"
 *       - type: object
 *         required:
 *           - symbol
 *           - country
 *         properties:
 *           symbol:
 *             description: Currency symbol
 *             type: string
 *             example: $
 *           country:
 *             description: Currency governing country code (ISO format)
 *             type: string
 *             example: US
 *
 */
