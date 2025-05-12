"use strict";

const validate = require("@root/src/middlewares/validator");
const { DepositTransaction, WithdrawTransaction, Transaction, CryptoWallet } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip, search } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");
const { TRANSACTION_KIND } = require("@src/constants");


// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
  bodyParser.json(),
  validate({
    query: Joi
      .object()
      .keys({
        field: Joi
          .string(),
        value: Joi
          .string(),
        page: Joi
          .number()
          .integer()
          .min(1)
          .default(1),
        limit: Joi
          .number()
          .integer()
          .min(1)
          .max(300)
          .default(300),
        select: Joi
          .array()
          .items(
            Joi
              .string()
              .valid(...DepositTransaction.getSelectableFields())
              .valid(...WithdrawTransaction.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function listTransactionsAdminV1Controller(req, res) {
    const {
      user,
      query: { page, limit, field, value },
    } = req;
    let {
      query: { select },
    } = req;

    let wallet_ids = await CryptoWallet.find({},
      "_id"
    );

    let output;
    output = search(field, value)
    output.$or = [
      {
        kind: TRANSACTION_KIND.DEPOSIT,
      },
      {
        kind: TRANSACTION_KIND.WITHDRAW,
      },
    ]

    output.$and = [
      {
        $or: [
          { to: { $in: wallet_ids.map(wallet => wallet._id) } },
          { from: { $in: wallet_ids.map(wallet => wallet._id) } }
        ],
      }
    ]

    const total_count = await Transaction.countDocuments(output),
      toIncludeBefore = [],
      toExcludeAfter = [],
      toSkip = pageToSkip(page, limit),
      toLimit = limit,
      page_count = +Math.ceil(total_count / limit),
      meta = {
        page,
        limit,
        page_count,
        total_count,
      };
    let transactions = [];
    let query = Transaction.find(output)
      .select(union(select, toIncludeBefore))
      .skip(toSkip)
      .limit(toLimit)
      .sort({ 'created_at': -1 });

    transactions = await query;
    transactions = transactions.map((transaction) => omit(transaction.toJSON(), difference(toExcludeAfter, select)));

    res.json({
      transactions,
      meta,
    });

  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
