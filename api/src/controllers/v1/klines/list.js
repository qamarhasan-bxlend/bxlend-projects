"use strict";

const { Joi } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const { listKlines } = require("@src/services");
const bodyParser = require("body-parser");
const { normalizeInterval } = require("@src/utils");


// ------------------------- Controller -------------------------

const CONTROLLER = [
  bodyParser.json(),
  validate({
    query: Joi
      .object()
      .keys({
        interval: Joi.string().regex(/\d+[mHD]/).default("1m"), //TODO: for ,W,M,Y
      }),
  }),
  async function listKlinesV1Controller(req, res) {
    const {
      params: { currency_pair },
      query: { interval },
    } = req;

    const normalizedInterval = normalizeInterval(interval);

    const klines = await listKlines({
      pair_symbol: currency_pair.symbol,
      interval: normalizedInterval,
    });

    res.json({
      klines,
    });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/admin/klines/{currency_pair}:
 *   get:
 *     tags:
 *       - Tickers
 *     description: List all of Tickers as klines ( aggregated )
 *     security:
 *       - OpenID Connect:
 *     produces:
 *      - application/json
 *     parameters:
 *       - $ref: "#/parameters/currency_pair_parameter"
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *         description: Bracket timeframe interval duration
 *         default: 1m
 *         examples:
 *           Minutes:
 *             summary: Example of a 10 (m)inute timeframe
 *             value: 10m
 *           Hours:
 *             summary: Example of a 1 (H)our timeframe
 *             value: 1H
 *           Days:
 *             summary: Example of a 1 (D)ay timeframe
 *             value: 1D
 *     responses:
 *       200:
 *         description: Klines listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - klines
 *               properties:
 *                 klines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         description: Bracket timeframe
 *                         format: date-time
 *                         example: 2021-09-02T15:20:00.000Z
 *                       open:
 *                         type: string
 *                         description: Candle ( Time bracket ) starting price
 *                         example: "3300.568"
 *                       close:
 *                         type: string
 *                         description: Candle ( Time bracket ) stopping price
 *                         example: "3301.0"
 *                       high:
 *                         type: string
 *                         description: Highest order price in the Candle ( Time bracket )
 *                         example: "3301.1"
 *                       low:
 *                         type: string
 *                         description: Lowest order price in the Candle ( Time bracket )
 *                         example: "3300"
 *       401:
 *         $ref: "#/responses/401"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */
