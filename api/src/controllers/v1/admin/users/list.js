"use strict";

const validate = require("@root/src/middlewares/validator");
const { User } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip,search } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");


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
              .valid(...User.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function listUsersAdminV1Controller(req, res) {
    const {
      query: { page, limit, field, value },
    } = req;
    let {
      query: { select },
    } = req;

    let output
    output = search(field, value)

    const total_count = await User.countDocuments(output),
      toBePopulated = [],
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

    let users = [];

    let query = User.find(output)
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

    users = await query;
    users = users.map((user) => omit(user.toJSON(), difference(toExcludeAfter, select)));

    res.json({
      users,
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
* /v1/admin/users:
*   get:
*     tags:
*       - System Users
*     description: List all of System Users'
*     security:
*       - OpenID Connect:
*     produces:
*      - application/json
*     responses:
*       200:
*         description: System Users' Listed Successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               required:
*                 - users
*                 - meta
*               properties:
*                 users:
*                   type: array
*                   items:
*                     $ref: "#/definitions/User"
*                 meta:
*                   $ref: "#/definitions/Meta"
*       401:
*         $ref: "#/responses/401"
*       404:
*         $ref: "#/responses/404"
*       500:
*         $ref: "#/responses/500"
*/