"use strict";

const validate = require("@root/src/middlewares/validator");
const { ManualDepositTransaction, ManualWithdrawTransaction } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { ERROR, TRANSACTION_STATUS } = require("@src/constants");
const { NotFound } = require("@src/errors");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    body: Joi.object().keys({
      description: Joi.string(),
      currency_code: Joi.string(),
      quantity: Joi.string(),
      from: Joi.string(),
      to: Joi.string(),
    }),
    params: Joi.object()
      .keys({
        manual_transaction_id: Joi.string().required(),
      })
      .required(),
    query: Joi.object().keys({
      select: Joi.array()
        .items(
          Joi.string()
            .valid(...ManualDepositTransaction.getSelectableFields()),
        )
        .default([]),
    }),
  }),
  async function updateManualWithdrawTransactionV1Controller(req, res) {
    const {
      user,
      query: { select },
      params: { manual_transaction_id },
      body,
    } = req;

    const toExcludeAfter = [];
    let manual_transaction;

    let query = ManualWithdrawTransaction.updateOne({
      _id: manual_transaction_id,
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    },{
      $set:{
        status: TRANSACTION_STATUS.PENDING,
        execution: {
          reason: null,
          isExecuted: false,
          timestamp: null,
          executor: null,
        },
        ...body,
      },
    });

    manual_transaction = await query;
    if( manual_transaction.nModified < 1 ) throw new NotFound(ERROR.MANUAL_TRANSACTION_NOT_FOUND);

    query = ManualWithdrawTransaction.findOne({
      _id: manual_transaction_id,
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    });

    manual_transaction = await query;
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
 * /v1/manual-transactions/withdraw/{manual_transaction_id}:
 *   patch:
 *     tags:
 *       - Manual Transactions
 *     description: Update a Manual Withdraw Transaction 
 *     security:
 *       - OpenID Connect:
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               currency_code:
 *                 type: string
 *               quantity:
 *                 type: string
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Manual Withdraw Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - manual_transaction
 *               properties:
 *                 manual_transaction:
 *                   $ref: "#/definitions/ManualWithdrawTransaction"
 *       401:
 *         $ref: "#/responses/401"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */