"use strict";

const validate = require("@root/src/middlewares/validator");
const { BankAccount } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { ERROR, BANK_ACCOUNT_STATUS } = require("@src/constants");
const { NotFound } = require("@src/errors");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
  bodyParser.json(),
  validate({
    body: Joi.object().keys({
      status: Joi.string().valid(...Object.values(BANK_ACCOUNT_STATUS)).required(),
    }).required(),
    params: Joi.object().keys({
      bank_account_id: Joi.string().required(),
    }).required(),
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...BankAccount.getSelectableFields()))
        .default([]),
    }),
  }),
  async function reviewBankAccountsAdminV1Controller(req, res) {
    const {
      user,
      params: { bank_account_id },
      query: { select },
      body,
    } = req;

    const toExcludeAfter = [];
    let bank_account;

    let query = BankAccount.updateOne(
      {
        _id: bank_account_id,
        deleted_at: {
          $exists: false,
        },
      },
      {
        $push:{
          reviews:{
            status: body.status,
            reviewer: user._id,
            timestamp: new Date(),
          },
        },
        $set:{ 
          status: body.status,
        },
      },
    );

    bank_account = await query;
    if( bank_account.nModified < 1 ) throw new NotFound(ERROR.BANK_ACCOUNT_NOT_FOUND);

    query = BankAccount.findOne({
      _id: bank_account_id,
      deleted_at: {
        $exists: false,
      },
    })
      .populate("owner", "-created_at -updated_at -password")
      .populate("reviews.reviewer", "-created_at -updated_at -password")
      .populate("bank_country", "-created_at -updated_at -password");

    bank_account = await query;
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
* /v1/admin/bank-accounts/{bank_account_id}:
*   patch:
*     tags:
*       - System User's Bank Accounts
*     description: Update a System User's Bank Account Status
*     security:
*       - OpenID Connect:
*     parameters:
*       - $ref: "#/parameters/bank_account_id_parameter"
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               status:
*                 description: Bank Account's Status
*                 type: string
*                 enum:
*                   - ACTIVE
*                   - SUSPENDED
*                 example: SUSPENDED
*     produces:
*      - application/json
*     responses:
*       200:
*         description: System User's Status Bank Account Updated Successfully
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