"use strict";

const { Joi } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const { Currency } = require("@src/models");
const { pageToSkip } = require("@src/utils");
const { omit } = require("lodash");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  validate({
    query: Joi
      .object()
      .keys({
        page: Joi
          .number()
          .integer()
          .min(1)
          .default(1),
        limit: Joi
          .number()
          .integer()
          .min(1),
        select: Joi
          .array()
          .items(
            Joi
              .string()
              .valid(...Currency.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function listCurrenciesV1Controller(req, res) {
    const { query: { page, limit } } = req;
    let { query: { select } } = req;

    const skip = pageToSkip(page, limit);
    let currencies = [];
    let page_count = 0;

    const total_count = await Currency.countDocuments();

    if (total_count > skip) {
      const query = Currency.find()
        .sort("code")
        .skip(skip)
        .limit(limit)
        .populate({
            path: "supported_blockchains.blockchain", // Assumes "blockchain" is the reference field in "supported_blockchains"
            model: "Blockchain" // Name of the Blockchain model
        });
        // console.log(limit)

      if (select.length > 0) {
        let fields = select.join(" ");

        if (!select.includes("kind")) fields += " kind";

        query.select(fields);
      }

      currencies = await query;

      if (select.length > 0) {
        const toOmit = [];

        if (!select.includes("id")) toOmit.push("id");

        if (!select.includes("kind")) toOmit.push("kind");

        currencies = currencies.map(currency => omit(currency.toJSON(), toOmit));
      }

      page_count = currencies.length;
    }

    res.json({
      currencies,
      meta: {
        page,
        limit,
        page_count,
        total_count,
      },
    });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/currencies:
 *   get:
 *     tags:
 *       - Currency
 *     description: Get currencies
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/page_query"
 *       - $ref: "#/parameters/limit_query"
 *       - description: "Select parameter"
 *         in: query
 *         name: select
 *         schema:
 *           type: string
 *           enum:
 *             - id
 *             - kind
 *             - code
 *             - name
 *             - display_decimals
 *             - symbol
 *             - country
 *             - decimals
 *             - icon
 *             - website
 *             - networks
 *             - created_at
 *             - updated_at
 *           default: []
 *           example:
 *             - code
 *             - name
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: The requested currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - currencies
 *                 - meta
 *               properties:
 *                 currencies:
 *                   type: array
 *                   items:
 *                     $ref: "#/definitions/Currency"
 *                 meta:
 *                   $ref: "#/definitions/Meta"
 *       400:
 *         $ref: "#/responses/400"
 *       401:
 *         $ref: "#/responses/401"
 *       500:
 *         $ref: "#/responses/500"
 */
