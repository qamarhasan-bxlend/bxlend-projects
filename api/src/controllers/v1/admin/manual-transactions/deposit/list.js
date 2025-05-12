"use strict";

const validate = require("@root/src/middlewares/validator");
const { ManualDepositTransaction } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth,adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip } = require("@src/utils/index");
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
  async function listManualDepositTransactionsAdminV1Controller(req, res) {
    const {
      query: { page, limit },
    } = req;
    let {
      query: { select },
    } = req;

    const total_count = await ManualDepositTransaction.countDocuments({
        deleted_at: {
          $exists: false,
        },
      }),
      toBePopulated = [
        {
          path: "owner",
          select: "-created_at -updated_at -password",
        },
        {
          path: "execution.executor",
          select: "-created_at -updated_at -password",
        },
        {
          path: "to",
          select: "-created_at -updated_at",
          populate: {
            path: "owner",
            select: "-created_at -updated_at -password",
          },
        },
      ],
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
      deleted_at: {
        $exists: false,
      },
    })
      .skip(toSkip)
      .limit(toLimit)
      .select(union(select, toIncludeBefore));
      
    toBePopulated.forEach(populate=>{
      if (select.length && select.includes(populate.path)){
        query.populate(populate);
      }else if (!select.length) {
        query.populate(populate);
      }
    });

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
* /v1/admin/manual-transactions/deposit:
*   get:
*     tags:
*       - System User's Transactions
*     description: List all of System User's Manual Deposit Transactions
*     security:
*       - OpenID Connect:
*     produces:
*      - application/json
*     responses:
*       200:
*         description: All System User's Manual Deposit Transactions listed successfully
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