"use strict";

const validate = require("@root/src/middlewares/validator");
const { BankAccount } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    params: Joi.object()
      .keys({
        bank_account_id: Joi.string().required(),
      })
      .required(),
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...BankAccount.getSelectableFields()))
        .default([]),
    }),
  }),
  async function showBankAccountV1Controller(req, res) {
    const {
      user,
      params: { bank_account_id },
      query: { select },
    } = req;

    const toExcludeAfter = [];
    let bank_account;

    let query = BankAccount.findOne({
      _id: bank_account_id,
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    });

    bank_account = await query;
    if(!bank_account) throw new NotFound(ERROR.BANK_ACCOUNT_NOT_FOUND);
    bank_account = omit(bank_account.toJSON(), difference(toExcludeAfter, select));

    res.json({ bank_account });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
* @swagger
* 
* /v1/bank-accounts/{bank_account_id}:
*   get:
*     tags:
*       - Bank Account
*     description: Retrive a Bank Account
*     security:
*       - OpenID Connect:
*     parameters:
*       - $ref: "#/parameters/bank_account_id_parameter"
*     produces:
*      - application/json
*     responses:
*       200:
*         description: Bank Account Retrived Successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               required:
*                 - bank_account
*               properties:
*                 bank_account:
*                   $ref: "#/definitions/BankAccount"
*       401:
*         $ref: "#/responses/401"
*       404:
*         $ref: "#/responses/404"
*       500:
*         $ref: "#/responses/500"
*/