"use strict";

const validate = require("@root/src/middlewares/validator");
const { DepositTransaction } = require("@src/models");
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
          .default(100),
        select: Joi
          .array()
          .items(
            Joi
              .string()
              .valid(...DepositTransaction.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function DepositTransactionsAdminV1Controller(req, res) {
    const {
      query: { page, limit },
    } = req;
    let {
      query: { select },
    } = req;
    
    const total_count = await DepositTransaction.countDocuments({
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

    let deposit_transactions = [];

    let query = DepositTransaction.find({
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

    deposit_transactions = await query;
    deposit_transactions = deposit_transactions.map((transaction) => omit(transaction.toJSON(), difference(toExcludeAfter, select)));

    res.json({
      deposit_transactions,
      meta,
    });

  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
