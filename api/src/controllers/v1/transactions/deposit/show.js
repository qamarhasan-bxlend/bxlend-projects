"use strict";

const validate = require("@root/src/middlewares/validator");
const { DepositTransaction, CryptoWallet } = require("@src/models");
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
        transaction_id: Joi.string().required(),
      })
      .required(),
    query: Joi.object().keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      select: Joi.array()
        .items(Joi.string().valid(...DepositTransaction.getSelectableFields()))
        .default([]),
    }),
  }),
  async function showDepositTransactionsV1Controller(req, res) {
    const {
      user,
      query: { select },
      params: { transaction_id },
    } = req;

    const toExcludeAfter = [];
    let deposit_transaction = [];

    let wallet_ids = await CryptoWallet.find(
      {
        owner: user._id,
      },
      "_id"
    );

    let query = DepositTransaction.findOne({
      $or: [
        {
          to: { $in: wallet_ids.map((wallet) => wallet._id) },
        },
        {
          from: { $in: wallet_ids.map((wallet) => wallet._id) },
        },
      ],
      _id: transaction_id,
      deleted_at: {
        $exists: false,
      },
    });

    deposit_transaction = await query;
    if (!deposit_transaction)
      throw new NotFound(ERROR.DEPOSIT_TRANSACTION_NOT_FOUND);
    deposit_transaction = omit(
      deposit_transaction.toJSON(),
      difference(toExcludeAfter, select)
    );

    res.json({ deposit_transaction });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;