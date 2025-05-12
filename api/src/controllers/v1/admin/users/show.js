"use strict";

const validate = require("@root/src/middlewares/validator");
const { User } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
  bodyParser.json(),
  validate({
    params: Joi.object()
      .keys({
        user_id: Joi.string().required(),
      })
      .required(),
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...User.getSelectableFields()))
        .default([]),
    }),
  }),
  async function showUserAdminV1Controller(req, res) {
    const {
      params: { user_id },
      query: { select },
    } = req;

    const toExcludeAfter = [];
    let user;

    let query = User.findOne({
      _id: user_id,
      deleted_at: {
        $exists: false,
      },
    });

    user = await query;
    if(!user) throw new NotFound(ERROR.USER_NOT_FOUND);
    user = omit(user.toJSON(), difference(toExcludeAfter, select));

    res.json({ user });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
* @swagger
* 
* /v1/admin/users/{user_id}:
*   get:
*     tags:
*       - System Users
*     description: Retrive a System User
*     security:
*       - OpenID Connect:
*     parameters:
*       - $ref: "#/parameters/user_id_parameter"
*     produces:
*      - application/json
*     responses:
*       200:
*         description: System User Retrived Successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               required:
*                 - user
*               properties:
*                 user:
*                   $ref: "#/definitions/User"
*       401:
*         $ref: "#/responses/401"
*       404:
*         $ref: "#/responses/404"
*       500:
*         $ref: "#/responses/500"
*/