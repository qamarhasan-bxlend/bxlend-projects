"use strict";

const { Joi } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const { CurrencyPair } = require("@src/models");
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
              .valid(...CurrencyPair.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function listCurrencyPairsV1Controller(req, res) {
    const { query: { page, limit, select } } = req;

    const skip = pageToSkip(page, limit);
    let pairs = [];
    let page_count = 0;

    const total_count = await CurrencyPair.countDocuments();

    if (total_count > skip) {
      let query = CurrencyPair.find()
        .skip(skip)
      
        if(limit){
          query = query.limit(limit);
        }

      if (select.length > 0) {
        query.select(select.map(field => field === "currencies" ? "currency_codes" : field).join(" "));
      }

      pairs = await query;

      if (select.length > 0) {
        const toOmit = [];

        if (!select.includes("id")) toOmit.push("id");

        pairs = pairs.map(currency => omit(currency.toJSON(), toOmit));
      }

      page_count = pairs.length;
    }

    res.json({
      pairs,
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
 * /v1/currency-pairs:
 *   get:
 *     tags:
 *       - CurrencyPair
 *     description: Get currency pairs
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
 *             - currencies
 *             - created_at
 *             - updated_at
 *           default: []
 *           example:
 *             - id
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: The requested currency pairs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - pairs
 *                 - meta
 *               properties:
 *                 pairs:
 *                   type: array
 *                   items:
 *                     $ref: "#/definitions/CurrencyPair"
 *                 meta:
 *                   $ref: "#/definitions/Meta"
 *       400:
 *         $ref: "#/responses/400"
 *       401:
 *         $ref: "#/responses/401"
 *       500:
 *         $ref: "#/responses/500"
 */
