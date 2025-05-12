"use strict";

const validate = require("@root/src/middlewares/validator");
const { Order } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const { pageToSkip } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");
const { ORDER_DIRECTION, OWNER,ORDER_TYPE,ORDER_STATUS,ORDER_KIND } = require("@src/constants");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  validate({
    query: Joi.object().keys({
      pair: Joi.string(),
      page: Joi.number().integer().min(1).default(1),
      type: Joi.string().valid(...Object.keys(ORDER_DIRECTION)),
      owner_type: Joi.string().valid(...Object.keys(OWNER)),
      limit: Joi.number().integer().min(1).default(10),
      kind : Joi.string().valid(...Object.keys(ORDER_KIND)),
      order_type: Joi.string().valid(...Object.keys(ORDER_TYPE)),
      select: Joi.array()
        .items(Joi.string().valid(...Order.getSelectableFields()))
        .default([]),
    }),
  }),
  async function listOrderV1Controller(req, res) {
    const {
      user,
      query: { page, limit, pair, type, owner_type,order_type,kind },
    } = req;
    const {
      query: { select },
    } = req;

    const filter = {
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    };

    if (pair) {
      filter.pair_symbol = pair;
    }
    if (type) {
      filter.direction = type;
    }
    if (owner_type) {
      filter.owner_type = owner_type;
    }
    if(kind){
      filter.kind = kind
    } 
    if (order_type) {
      let allowedStatuses = [];
    
      if (order_type === "OPEN_ORDER") {
        allowedStatuses = [ORDER_STATUS.ACTIVE, ORDER_STATUS.PENDING];
      } else if (order_type === "ORDER_HISTORY") {
        allowedStatuses = [ORDER_STATUS.FULFILLED, ORDER_STATUS.CANCELLED, ORDER_STATUS.FAILED];
      } else if (order_type === "TRADE_HISTORY") {
        allowedStatuses = [ORDER_STATUS.FULFILLED];
      }
      
      if (allowedStatuses.length > 0) {
        filter.status = { $in: allowedStatuses };
      }
    }
    
    const total_count = await Order.countDocuments(filter);

    let orders = [];
    let toIncludeBefore = [];
    let toExcludeAfter = [];
    let toSkip = pageToSkip(page, limit);
    let toLimit = limit;
    let page_count = Math.ceil(total_count / limit);

    if (total_count > 0) {
      orders = await Order.find(filter)
        .select(union(select, toIncludeBefore))
        .sort({ created_at: -1 })
        .skip(toSkip)
        .limit(toLimit);

      if (Array.isArray(orders)) {
        orders = orders.map((order) =>
          omit(order.toJSON(), difference(toExcludeAfter, select))
        );
      }
    }

    const meta = {
      page,
      limit,
      page_count,
      total_count,
    };

    res.json({
      orders,
      meta,
    });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/orders/{order_id}:
 *   get:
 *     tags:
 *       - Order
 *     description: Show User's Order by id
 *     parameters:
 *       - $ref: "#/parameters/order_id_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Order Fetched successfully
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
