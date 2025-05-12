"use strict";

const validate = require("@root/src/middlewares/validator");
const { ManualDepositTransaction } = require("@src/models");
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
              .valid(...ManualDepositTransaction.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function listManualDepositTransactionsV1Controller(req, res) {
    const {
      query: { page, limit },
    } = req;
    let {
      user,
      query: { select },
    } = req;

    const total_count = await ManualDepositTransaction.countDocuments({
        owner: user._id,
        deleted_at: {
          $exists: false,
        },
      }),
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

    let manual_transactions = [];

    let query = ManualDepositTransaction.find({
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    })
      .select(union(select, toIncludeBefore))
      .skip(toSkip)
      .limit(toLimit);

    manual_transactions = await query;
    manual_transactions = manual_transactions.map((tranasction) => omit(tranasction.toJSON(), difference(toExcludeAfter, select)));

    res.json({
      manual_transactions,
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
* /v1/manual-transactions/deposit:
*   get:
*     tags:
*       - Manual Transactions
*     description: List all Manual Deposit Transactions
*     security:
*       - OpenID Connect:
*     produces:
*      - application/json
*     responses:
*       200:
*         description: All Deposit Manual Transactions listed successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               required:
*                 - manual_transactions
*                 - meta
*               properties:
*                 manual_transactions:
*                   type: array
*                   items:
*                     $ref: "#/definitions/ManualDepositTransaction"
*                 meta:
*                   $ref: "#/definitions/Meta"
*       401:
*         $ref: "#/responses/401"
*       404:
*         $ref: "#/responses/404"
*       500:
*         $ref: "#/responses/500"
*/