"use strict";

const validate = require("@root/src/middlewares/validator");
const { ManualWithdrawTransaction, ManualDepositTransaction, Transaction } = require("@src/models");
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
        manual_transaction_id: Joi.string().required(),
      })
      .required(),
    query: Joi.object().keys({
      select: Joi.array()
        .items(
          Joi.string()
            .valid(...ManualWithdrawTransaction.getSelectableFields())
            .valid(...ManualDepositTransaction.getSelectableFields()),
        )
        .default([]),
    }),
  }),
  async function showManualTransactionV1Controller(req, res) {
    const {
      user,
      params: { manual_transaction_id },
      query: { select },
    } = req;

    const toExcludeAfter = [];
    let manual_transaction;

    let query = Transaction.findOne({
      kind: {
        $in: [
          TRANSACTION_KIND.MANUAL_DEPOSIT,
          TRANSACTION_KIND.MANUAL_WITHDRAW,
        ],
      },
      _id: manual_transaction_id,
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    });

    manual_transaction = await query;
    if (!manual_transaction) throw new NotFound(ERROR.MANUAL_TRANSACTION_NOT_FOUND);

    
    manual_transaction = omit(manual_transaction.toJSON(), difference(toExcludeAfter, select));

    res.json({ manual_transaction });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/manual-transactions/{manual_transaction_id}:
 *   get:
 *     tags:
 *       - Manual Transactions
 *     description: Show a Manual Transaction ( either deposit or withdraw )
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/manual_transaction_id_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Manual Transaction fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - manual_transaction
 *               properties:
 *                 manual_transaction:
 *                   oneOf:
 *                     - $ref: "#/definitions/ManualWithdrawTransaction"
 *                     - $ref: "#/definitions/ManualDepositTransaction"
 *       401:
 *         $ref: "#/responses/401"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */