"use strict";

const { Joi } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const { Wallet } = require("@src/models");
const { union, pick } = require("lodash");
const { showOrCreateWalletService } = require("@src/services");
const {
  WalletCurrencyUnsupported,
  BitgoForbiddenCountry,
  BitgoUnauthorizedError,
  Forbidden,
  HTTPError,
} = require("@src/errors");
const { STATUS_CODE } = require("@src/constants");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  validate({
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...Wallet.getSelectableFields()))
        .default([]),
    }),
  }),
  async function showWalletV1Controller(req, res) {
    const {
      user,
      params: { currency },
      query: { select },
    } = req;

    const currency_code = currency.code,
      toIncludeBefore = [];

    let wallet;

    try {
      wallet = await showOrCreateWalletService({ user, currency_code }, null, {
        select: union(select, toIncludeBefore),
      });
    } catch (error) {
      if (error instanceof WalletCurrencyUnsupported) throw error;
      else if (error instanceof BitgoForbiddenCountry) {
        throw new Forbidden("This action is banned in this country");
      } else if (error instanceof BitgoUnauthorizedError) {
        throw new HTTPError(STATUS_CODE.INTERNAL_SERVER_ERROR, "Internal Server Error");
      }
    }
    
    if(select && select.length) wallet = pick(wallet.toJSON(), select);

    res.json({
      wallet,
    });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/wallets:
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
