"use strict";

const { auth } = require("@src/middlewares");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  async function showCurrencyPairV1Controller(req, res) {
    const { params: { currency_pair } } = req;

    res.json({ pair: currency_pair });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/currency-pairs/{currency_pair_id}:
 *   get:
 *     tags:
 *       - CurrencyPair
 *     description: Get currency pair by id
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/currency_pair_id_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: The requested currency pair
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - pair
 *               properties:
 *                 pair:
 *                   $ref: "#/definitions/CurrencyPair"
 *       401:
 *         $ref: "#/responses/401"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */
