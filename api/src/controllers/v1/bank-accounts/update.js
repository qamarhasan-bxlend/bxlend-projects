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
        bank_name: Joi.string(),
        bank_country: Joi.string(),
        account_number: Joi.string(),
        swift_bic_code: Joi.string(),
        currency: Joi.string(),
      }),
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...BankAccount.getSelectableFields()))
        .default([]),
    }),
  }),
  async function updateBankAccountV1Controller(req, res) {
    const {
      user,
      params: { bank_account_id },
      query: { select },
      body,
    } = req;

    const toExcludeAfter = ["id", "kind"];
    let bank_account;

    let query = BankAccount.updateOne(
      {
        _id: bank_account_id,
        owner: user._id,
        deleted_at: {
          $exists: false,
        },
      },
      {
        $set:{ ...body }, 
      },
    );

    bank_account = await query;
    if( bank_account.nModified < 1 ) throw new NotFound(ERROR.BANK_ACCOUNT_NOT_FOUND);

    query = BankAccount.findOne({
      _id: bank_account_id,
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    });

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
* /v1/bank-accounts/{bank_account_id}:
*   patch:
*     tags:
*       - Bank Account
*     description: Update a Bank Account
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
*               bank_name:
*                 description: Bank Name
*                 type: string
*                 example: National Bank of the Hong Kong
*               bank_country:
*                 description: Bank located country ID
*                 type: string
*                 example: 61210f00ac8dccc57c18e10c
*               account_number:
*                 description: Bank Account number
*                 type: string
*                 example: "1001001234"
*               swift_bic_code:
*                 description: Swift/BIC code
*                 type: string
*                 example: AAAABBCC123
*               currency:
*                 description: Currency ID
*                 type: string
*                 example: 61210f07b3b446091f309797
*     produces:
*      - application/json
*     responses:
*       200:
*         description: Bank Account Updated Successfully
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