"use strict";

const { auth } = require("@src/middlewares");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  async function showCurrencyV1Controller(req, res) {
    const { params: { currency } } = req;

    res.json({ currency });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/currencies/{currency_id}:
 *   get:
 *     tags:
 *       - Currency
 *     description: Get currency by id
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/currency_id_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: The requested currency
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - currency
 *               properties:
 *                 currency:
 *                   $ref: "#/definitions/Currency"
 *       401:
 *         $ref: "#/responses/401"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */
