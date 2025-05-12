"use strict";

const validate = require("@root/src/middlewares/validator");
const { AdminSetting } = require("@src/models");
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
    body: Joi.object()
      .keys({
        value: Joi.string().required(),
      }).required(),
    params: Joi.object()
      .keys({
        setting_id: Joi.string().required(),
      }).required(),
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...AdminSetting.getSelectableFields()))
        .default([]),
    }),
  }),
  async function updateSettingAdminV1Controller(req, res) {
    const {
      params: { setting_id },
      query: { select },
      body: { value },
    } = req;

    const toExcludeAfter = [];
    let setting;

    let query = AdminSetting.updateOne(
      {
        _id: setting_id,
        deleted_at: {
          $exists: false,
        },
      },
      {
        $set:{
          value,
        }, 
      },
    );

    setting = await query;
    if( setting.nModified < 1 ) throw new NotFound(ERROR.SETTING_NOT_FOUND);

    query = AdminSetting.findOne({
      _id: setting_id,
      deleted_at: {
        $exists: false,
      },
    });

    setting = await query;
    setting = omit(setting.toJSON(), difference(toExcludeAfter, select));

    res.json({ setting });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
* @swagger
* 
* /v1/admin/settings/{setting_id}:
*   patch:
*     tags:
*       - Administrator Settings/Constants
*     description: Update a Admin's Setting
*     security:
*       - OpenID Connect:
*     parameters:
*       - $ref: "#/parameters/setting_id_parameter"
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               value:
*                 description: Admin's Setting value
*                 type: string
*                 example: 1.245
*     produces:
*      - application/json
*     responses:
*       200:
*         description: Admin's Setting Updated Successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               required:
*                 - setting
*               properties:
*                 setting:
*                   $ref: "#/definitions/AdminSetting"
*       401:
*         $ref: "#/responses/401"
*       404:
*         $ref: "#/responses/404"
*       500:
*         $ref: "#/responses/500"
*/