"use strict";

const { Joi } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const { Country } = require("@src/models");
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
          .min(0)
          .default(10),
        select: Joi
          .array()
          .items(
            Joi
              .string()
              .valid(...Country.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function listCountriesV1Controller(req, res) {
    const { query: { page, limit } } = req;
    let { query: { select } } = req;

    const skip = pageToSkip(page, limit);
    let countries = [];
    let page_count = 0;

    const total_count = await Country.countDocuments();

    if (total_count > skip) {
      const query = Country.find()
        .sort("code")
        .skip(skip);

      if (limit > 0) query.limit(limit);

      if (select.length > 0) query.select(select.join(" "));

      countries = await query;

      if (select.length > 0 && !select.includes("id")) {
        countries = countries.map(country => omit(country.toJSON(), ["id"]));
      }

      page_count = countries.length;
    }

    res.json({
      countries,
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
 * /v1/countries:
 *   get:
 *     tags:
 *       - Country
 *     description: Get countries
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/page_query"
 *       - description: "Pagination limit parameter (`0` means no limit)"
 *         in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 0
 *           default: 10
 *           example: 25
 *       - description: "Select parameter"
 *         in: query
 *         name: select
 *         schema:
 *           type: string
 *           enum:
 *             - id
 *             - code
 *             - name
 *             - phone_code
 *             - language
 *             - currency
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
 *         description: The requested countries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - countries
 *                 - meta
 *               properties:
 *                 countries:
 *                   type: array
 *                   items:
 *                     $ref: "#/definitions/Country"
 *                 meta:
 *                   $ref: "#/definitions/Meta"
 *       400:
 *         $ref: "#/responses/400"
 *       401:
 *         $ref: "#/responses/401"
 *       500:
 *         $ref: "#/responses/500"
 */
