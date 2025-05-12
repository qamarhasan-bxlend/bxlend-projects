"use strict";

const validate = require("@root/src/middlewares/validator");
const { ManualDepositTransaction, FiatWallet } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth,adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { ERROR, TRANSACTION_STATUS, WALLET_OWNER } = require("@src/constants");
const { NotFound } = require("@src/errors");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  adminAuth(),
  auth(),
  bodyParser.json(),
  validate({
    body: Joi.object().keys({
      status: Joi.string().valid(TRANSACTION_STATUS.FAILED,TRANSACTION_STATUS.SUCCESS).required(),
      reason: Joi.string(),
    }).required(),
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
  async function executeManualDepositTransactionAdminV1Controller(req, res) {
    const {
      user,
      query: { select },
      body: { reason, status },
      params: { manual_transaction_id },
      body,
    } = req;

    const toExcludeAfter = [];
    let manual_transaction, wallet;

    let query = ManualDepositTransaction.updateOne({
      _id: manual_transaction_id,
      deleted_at: {
        $exists: false,
      },
    },{
      $set:{
        status,
        execution: {
          reason,
          isExecuted: true,
          timestamp: new Date(),
          executor: user._id,
        },
        ...body,
      },
    });

    manual_transaction = await query;
    if( manual_transaction.nModified < 1 ) throw new NotFound(ERROR.MANUAL_TRANSACTION_NOT_FOUND);

    query = ManualDepositTransaction.findOne({
      _id: manual_transaction_id,
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

    manual_transaction = await query;

    if( status === TRANSACTION_STATUS.SUCCESS ) {

      /*
        Followed by this issue i couldn't apply an upsert on FiatWallet because i needed to both set ballance on $setOnInsert and in $set
        https://stackoverflow.com/questions/50947772/updating-the-path-x-would-create-a-conflict-at-x
        MongoDB Issue: "Field should appear either in $set, or in $setOnInsert. Not in both."
      */
      query = FiatWallet.findOne({
        owner: manual_transaction.owner,
        currency_code : manual_transaction.currency_code,
        deleted_at: {
          $exists: false,
        },
      });

      wallet = await query;

      if(wallet){

        wallet.balance = parseFloat(wallet.balance) + parseFloat(manual_transaction.quantity);

      }else {

        wallet = new FiatWallet({
          owner: manual_transaction.owner,
          owner_type: WALLET_OWNER.USER,
          currency_code: manual_transaction.currency_code,
          balance: manual_transaction.quantity,
          available_balance: manual_transaction.quantity,
        });

      }

      await wallet.save();

    }
    
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
 * /v1/admin/manual-transactions/deposit/{manual_transaction_id}/execute:
 *   patch:
 *     tags:
 *       - System User's Manual Transactions
 *     description: Execute System User's Deposit Manual Transaction 
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/manual_transaction_id_parameter"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 description: Execution status
 *                 type: string
 *                 enum:
 *                   - SUCCESS
 *                   - FAILED
 *                 example: SUSPENDED
 *               reason:
 *                 description: Execution failure reason
 *                 type: string
 *                 example: Failed due to not receiving the payment in the bank system
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: System User's Deposit Manual Transaction executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - manual_transaction
 *               properties:
 *                 manual_transaction:
 *                   $ref: "#/definitions/ManualDepositTransaction"
 *       401:
 *         $ref: "#/responses/401"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */
