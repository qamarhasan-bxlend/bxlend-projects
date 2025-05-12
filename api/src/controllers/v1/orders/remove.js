"use strict";

const { OrderBook } = require("@src/events");
const validate = require("@root/src/middlewares/validator");
const { Order } = require("@src/models");
const { Joi } = require("@src/lib");
const { STATUS_MESSAGE } = require("@src/constants");
const { NotFound } = require("@src/errors");
const { auth } = require("@src/middlewares");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  validate({
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...Order.getSelectableFields()))
        .default([]),
    }),
  }),
  async function removeOrderV1Controller(req, res) {
    const { user, params: { order_id } } = req;

    const order = await Order.findOne({
      _id: order_id,
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    });
    if (!order) throw new NotFound();

    //TODO: Remove from trade engine pipeline
    //TODO: Block if in queue
    //TODO: Update wallet.available balance

    order.deleted_at = new Date();
    await order.save();

    res.json({ message: STATUS_MESSAGE.OK });

    OrderBook.emit(order.pair_symbol);
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/orders/{order_id}:
 *   delete:
 *     tags:
 *       - Order
 *     description: Cancel User's Order by id
 *     parameters:
 *       - $ref: "#/parameters/order_id_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Order Canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OK"
 *       401:
 *         $ref: "#/responses/401"
 *       403:
 *         $ref: "#/responses/403"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */
