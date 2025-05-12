"use strict";

const validate = require("@root/src/middlewares/validator");
const {
  WithdrawTransaction,
  DepositTransaction,
  Transaction, CryptoWallet
} = require("@src/models");
const { Joi } = require("@src/lib");
const { auth ,adminAuth} = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { ERROR, TRANSACTION_KIND } = require("@src/constants");
const { NotFound } = require("@src/errors");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
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
            .valid(...DepositTransaction.getSelectableFields())
        )
        .default([]),
    }),
  }),
  async function showTransactionAdminV1Controller(req, res) {
    const {
      user,
      params: { transaction_id },
      query: { select },
    } = req;

    const toExcludeAfter = [];
    let transaction;

    let query = Transaction.findOne({
      $or: [
        {
          kind: TRANSACTION_KIND.DEPOSIT,
        },
        {
          kind: TRANSACTION_KIND.WITHDRAW,
        },
      ],
      _id: transaction_id,
      deleted_at: {
        $exists: false,
      },
    })
      .populate("owner", "-created_at -updated_at -password")
      .populate("execution.executor", "-created_at -updated_at -password")
      .populate({
        path: "to",
        select: "-created_at -updated_at",
        populate: {
          path: "owner",
          select: "-created_at -updated_at -password",
        },
      });

    transaction = await query;
    if (!transaction) throw new NotFound(ERROR.TRANSACTION_NOT_FOUND);

    transaction = omit(
      transaction.toJSON(),
      difference(toExcludeAfter, select)
    );

    res.json({ transaction });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
