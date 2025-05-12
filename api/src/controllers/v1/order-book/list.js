"use strict";

const validate = require("@root/src/middlewares/validator");
const { auth } = require("@src/middlewares");
const { orderBook } = require("@src/services");
const bodyParser = require("body-parser");
const { Joi } = require("@src/lib");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    query: Joi
      .object()
      .keys({
        precision: Joi
          .string()
          .custom((value, helper) => {
            if (isNaN(+value))
              return helper.message("\"precision\" must only be numeric value");
            else return value;
          })
          .default("0.01"),
      }),
  }),
  async function listOrderBookV1Controller(req, res) {
    const {
      params: { currency_pair },
      query: { precision },
    } = req;

    const order_book = await orderBook({
      pair_symbol: currency_pair.symbol,
      precision,
    });

    res.json({
      order_book,
    });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/order-book/{currency_pair}:
 *   get:
 *     tags:
 *       - Order Book
 *     description: List all Order Book items
 *     security:
 *       - OpenID Connect:
 *     produces:
 *      - application/json
 *     parameters:
 *       - $ref: "#/parameters/currency_pair_parameter"
 *       - in: query
 *         name: precision
 *         schema:
 *           type: string
 *         description: Cutting ( Rounding ) precision value
 *         default: 1m
 *         examples:
 *           Example:
 *             summary: Example of a 0.1 cutting precision ( e.g. converts 14.456 to 14.4 )
 *             value: 0.1
 *           Default:
 *             summary: Default value
 *             value: 0.01
 *     responses:
 *       200:
 *         description: Order Book Listed Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - order_book
 *                 - meta
 *               properties:
 *                 order_book:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum:
 *                           - SELL
 *                           - BUY
 *                       orders:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             price:
 *                               type: string
 *                               example: "3300.000"
 *                             quantity:
 *                               type: string
 *                               example: "3.633"
 *       401:
 *         $ref: "#/responses/401"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */
