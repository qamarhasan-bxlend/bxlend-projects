"use strict";

const validate = require("@root/src/middlewares/validator");
const { WithdrawTransaction, CryptoWallet } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");
const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    query: Joi.object().keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1),
      select: Joi.array()
        .items(Joi.string().valid(...WithdrawTransaction.getSelectableFields()))
        .default([]),
    }),
  }),
  async function listWithdrawTransactionsV1Controller(req, res) {
    const {
      query: { page, limit },
    } = req;
    let {
      user,
      query: { select },
    } = req;

    let wallet_ids = await CryptoWallet.find(
      {
        owner: user._id,
      },
      "_id"
    );

    const total_count = await WithdrawTransaction.countDocuments({
      $or: [
        {
          to: { $in: wallet_ids.map((wallet) => wallet._id) },
        },
        {
          from: { $in: wallet_ids.map((wallet) => wallet._id) },
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

    let withdraw_transaction = [];

    let query = WithdrawTransaction.find({
      $or: [
        {
          to: { $in: wallet_ids.map((wallet) => wallet._id) },
        },
        {
          from: { $in: wallet_ids.map((wallet) => wallet._id) },
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
    withdraw_transaction = await query;
    withdraw_transaction = withdraw_transaction.map((transaction) =>
      omit(transaction.toJSON(), difference(toExcludeAfter, select))
    );

    res.json({
      withdraw_transaction,
      meta,
    });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
