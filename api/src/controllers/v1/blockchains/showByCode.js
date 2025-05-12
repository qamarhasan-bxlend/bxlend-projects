"use strict";

const { auth } = require("@src/middlewares");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  async function showCurrencyByCodeV1Controller(req, res) {
    const { params: { currency_code } } = req;

    res.json({ currency_code });
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
