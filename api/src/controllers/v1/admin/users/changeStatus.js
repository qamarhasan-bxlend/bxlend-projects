"use strict";

const validate = require("@root/src/middlewares/validator");
const { User } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { ERROR, USER_STATUS } = require("@src/constants");
const { NotFound } = require("@src/errors");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
  bodyParser.json(),
  validate({
    body: Joi.object()
      .keys({
        status: Joi.string().valid(...Object.values(USER_STATUS)).required(),
      }).required(),
    params: Joi.object()
      .keys({
        user_id: Joi.string().required(),
      }),
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...User.getSelectableFields()))
        .default([]),
    }),
  }),
  async function updateBankAccountV1Controller(req, res) {
    const {
      params: { user_id },
      query: { select },
      body,
    } = req;

    const toExcludeAfter = [];
    let user;

    let query = User.updateOne(
      {
        _id: user_id,
        deleted_at: {
          $exists: false,
        },
      },
      {
        $set:{ ...body }, 
      },
    );

    user = await query;
    if( user.nModified < 1 ) throw new NotFound(ERROR.USER_NOT_FOUND);

    query = User.findOne({
      _id: user_id,
      deleted_at: {
        $exists: false,
      },
    });

    user = await query;
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
*   patch:
*     tags:
*       - System Users
*     description: Update a System User's Status
*     security:
*       - OpenID Connect:
*     parameters:
*       - $ref: "#/parameters/user_id_parameter"
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               status:
*                 description: User's Status
*                 type: string
*                 enum:
*                   - ACTIVE
*                   - SUSPENDED
*                 example: SUSPENDED
*     produces:
*      - application/json
*     responses:
*       200:
*         description: System User's Status Updated Successfully
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