"use strict";

const validate = require("@root/src/middlewares/validator");
const { BankAccount } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");


// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    query: Joi
      .object()
      .keys({
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
              .valid(...BankAccount.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function listBankAccountsV1Controller(req, res) {
    const {
      user,
      query: { page, limit },
    } = req;
    let {
      query: { select },
    } = req;

    const total_count = await BankAccount.countDocuments({
        deleted_at: {
          $exists: false,
        },
      }),
      toBePopulated = [],
      toIncludeBefore = [],
      toExcludeAfter = [],
      toSkip = pageToSkip(page, limit),
      toLimit = limit,
      page_count = +Math.ceil(total_count/limit),
      meta = {
        page,
        limit,
        page_count,
        total_count,
      };
    let bank_accounts = [];

    let query = BankAccount.find({
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    })
      .select(union(select, toIncludeBefore))
      .skip(toSkip)
      .limit(toLimit);

    toBePopulated.forEach(populate=>{
      if (select.length && select.includes(populate.path)){
        query.populate(populate);
      }else if (!select.length) {
        query.populate(populate);
      }
    });

    bank_accounts = await query;
    bank_accounts = bank_accounts.map((account) => omit(account.toJSON(), difference(toExcludeAfter, select)));

    res.json({
      bank_accounts,
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
* /v1/bank-accounts:
*   get:
*     tags:
*       - Bank Account
*     description: List all of User's Bank Accounts
*     security:
*       - OpenID Connect:
*     produces:
*      - application/json
*     responses:
*       200:
*         description: Bank Accounts Listed Successfully
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: "#/definitions/BankAccount"
*       401:
*         $ref: "#/responses/401"
*       404:
*         $ref: "#/responses/404"
*       500:
*         $ref: "#/responses/500"
*/