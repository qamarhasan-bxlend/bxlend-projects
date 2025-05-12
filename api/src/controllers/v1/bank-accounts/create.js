"use strict";

const validate = require("@root/src/middlewares/validator");
const { BankAccount } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    body: Joi.object()
      .keys({
        bank_name: Joi.string().required(),
        bank_country: Joi.string().required(),
        account_number: Joi.string().required(),
        swift_bic_code: Joi.string().required(),
        currency: Joi.string().required(),
      })
      .required(),
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...BankAccount.getSelectableFields()))
        .default([]),
    }),
  }),
  async function createBankAccountV1Controller(req, res) {
    const {
      user,
      body: { bank_name, bank_country, account_number, swift_bic_code, currency },
      query: { select },
    } = req;

    const toExcludeAfter = ["id", "kind"];
    let bank_account;

    let query = BankAccount.create({
      owner: user._id,
      bank_name,
      bank_country,
      account_number,
      swift_bic_code,
      currency,
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
* /v1/bank-accounts:
*   post:
*     tags:
*       - Bank Account
*     description: Create a Bank Account
*     security:
*       - OpenID Connect:
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - bank_name
*               - bank_country
*               - account_number
*               - swift_bic_code
*               - currency
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
*         description: Bank Account Created Successfully
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