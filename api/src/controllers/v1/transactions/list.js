"use strict";

const validate = require("@root/src/middlewares/validator");
const {
  DepositTransaction,
  WithdrawTransaction,
  Transaction,
  CryptoWallet,
} = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");
const { TRANSACTION_KIND } = require("@src/constants");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    query: Joi.object().keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1),
      select: Joi.array()
        .items(
          Joi.string()
            .valid(...DepositTransaction.getSelectableFields())
            .valid(...WithdrawTransaction.getSelectableFields())
        )
        .default([]),
    }),
  }),
  async function listTransactionsV1Controller(req, res) {
    const {
      user,
      query: { page, limit },
    } = req;
    let {
      query: { select },
    } = req;

    let wallet_ids = await CryptoWallet.find(
      {
        owner: user._id,
      },
      "_id"
    );
    const total_count = await Transaction.countDocuments({
      $or: [
        {
          to: { $in: wallet_ids.map((wallet) => wallet._id) },
        },
        {
          from: { $in: wallet_ids.map((wallet) => wallet._id) },
        },
      ],
      $and: [
        {
          $or: [
            {
              kind: TRANSACTION_KIND.DEPOSIT,
            },
            {
              kind: TRANSACTION_KIND.WITHDRAW,
            },
          ],
        },
      ],
      deleted_at: {
        $exists: false,
      },
    }),
      toIncludeBefore = [],
      toExcludeAfter = [];
    const toSkip = pageToSkip(page, limit),
      toLimit = limit;
    let page_count = 1;
    if (limit) page_count = +Math.ceil(total_count / limit);
    const meta = {
      page,
      limit,
      page_count,
      total_count,
    };

    let transactions = [];

    let query = Transaction.find({
      $or: [
        {
          kind: TRANSACTION_KIND.DEPOSIT,
        },
        {
          kind: TRANSACTION_KIND.WITHDRAW,
        },
      ],
      $and: [
        {
          $or: [
            { to: { $in: wallet_ids.map((wallet) => wallet._id) } },
            { from: { $in: wallet_ids.map((wallet) => wallet._id) } },
          ],
        },
      ],

      deleted_at: {
        $exists: false,
      },
    })
      .select(union(select, toIncludeBefore))
      .skip(toSkip)
      .sort({ "updated_at": -1 })

    if (toLimit) {
      query = query.limit(toLimit);
    }

    transactions = await query;
    transactions = transactions.map((transaction) =>
      omit(transaction.toJSON(), difference(toExcludeAfter, select))
    );

    res.json({
      transactions,
      meta,
    });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
