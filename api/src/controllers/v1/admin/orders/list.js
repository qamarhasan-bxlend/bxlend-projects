"use strict";

const validate = require("@root/src/middlewares/validator");
const { Order } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip, search } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");
const { MODEL: NAME } = require("@src/constants");


// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
  bodyParser.json(),
  validate({
    query: Joi
      .object()
      .keys({
        field: Joi
          .string(),
        value: Joi
          .string(),
        page: Joi
          .number()
          .integer()
          .min(1)
          .default(1),
        limit: Joi
          .number()
          .integer()
          .min(1)
          .max(100)
          .default(10),
        select: Joi
          .array()
          .items(
            Joi
              .string()
              .valid(...Order.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function listUsersOrdersAdminV1Controller(req, res) {
    const {
      query: { page, limit, field, value },
    } = req;
    let {
      query: { select },
    } = req;

    let output
    output = search(field, value)

    const total_count = await Order.countDocuments(output),
      toBePopulated = [
        {
          path: "owner",
          select: "-created_at -updated_at -password",
          model: NAME.USER,
        },
        {
          path: "wallets",
          select: "-created_at -updated_at",
        },
      ],
      toIncludeBefore = [],
      toExcludeAfter = [],
      toSkip = pageToSkip(page, limit),
      toLimit = limit,
      page_count = +Math.ceil(total_count / limit),
      meta = {
        page,
        limit,
        page_count,
        total_count,
      };

    let orders = [];

    let query = Order.find(output)
      .select(union(select, toIncludeBefore))
      .skip(toSkip)
      .limit(toLimit)
      .sort({ 'created_at': -1 });
      
    toBePopulated.forEach(populate => {
      if (select.length && select.includes(populate.path)) {
        query.populate(populate);
      } else if (!select.length) {
        query.populate(populate);
      }
    });

    orders = await query;
    orders = orders.map((order) => omit(order.toJSON(), difference(toExcludeAfter, select)));

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
* /v1/admin/orders:
*   get:
*     tags:
*       - System User's Orders
*     description: List all of the Orders
*     security:
*       - OpenID Connect:
*     produces:
*      - application/json
*     responses:
*       200:
*         description: All Orders Listed Successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               required:
*                 - orders
*                 - meta
*               properties:
*                 orders:
*                   type: array
*                   items:
*                     $ref: "#/definitions/Order"
*                 meta:
*                   $ref: "#/definitions/Meta"
*       401:
*         $ref: "#/responses/401"
*       404:
*         $ref: "#/responses/404"
*       500:
*         $ref: "#/responses/500"
*/