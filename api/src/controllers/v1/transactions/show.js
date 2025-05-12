"use strict";

const validate = require("@root/src/middlewares/validator");
const { WithdrawTransaction, DepositTransaction, Transaction } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { ERROR, TRANSACTION_KIND } = require("@src/constants");
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
      select: Joi.array()
        .items(
          Joi.string()
            .valid(...WithdrawTransaction.getSelectableFields())
            .valid(...DepositTransaction.getSelectableFields()),
        )
        .default([]),
    }),
  }),
  async function showTransactionV1Controller(req, res) {
    const {
      user,
      params: { transaction_id },
      query: { select },
    } = req;

    const toExcludeAfter = [];
    let transactions;

    let query = Transaction.findOne({
      $or:[
        {
          kind: TRANSACTION_KIND.DEPOSIT,
        },
        {
          kind: TRANSACTION_KIND.WITHDRAW,
        },
      ],
      _id: transaction_id,
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    });

    transactions = await query;
    if (!transactions) throw new NotFound(ERROR.TRANSACTION_NOT_FOUND);

    
    transactions = omit(transactions.toJSON(), difference(toExcludeAfter, select));

    res.json({ transactions });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
