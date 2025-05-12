"use strict";

const { ManualWithdrawTransaction, FiatWallet } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const { ERROR, TRANSACTION_STATUS, S3_UPLOAD_FOLDER, S3_ACL } = require("@src/constants");
const { HTTPError } = require("@src/errors");
const { S3 } = require("@src/lib");
const multer = require("multer")();
const { omit, difference } = require("lodash");
const { STATUS_CODES } = require("http");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  multer.array(S3_UPLOAD_FOLDER.MANUAL_TRANSACTIONS, 5),
  validate({
    body: Joi.object().keys({
      status: Joi.string().valid(TRANSACTION_STATUS.FAILED, TRANSACTION_STATUS.SUCCESS).required(),
      reason: Joi.string(),
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
            .valid(...ManualWithdrawTransaction.getSelectableFields()),
        )
        .default([]),
    }),
  }),
  async function executeManualWithdrawTransactionAdminV1Controller(req, res) {
    const {
      user,
      query: { select },
      params: { manual_transaction_id },
      body: { reason, status },
    } = req;

    const toExcludeAfter = [];

    let query = ManualWithdrawTransaction.findOne({
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

    let manual_transaction = await query, wallet;

    if (manual_transaction.execution.isExecuted) return res.json({ manual_transaction });

    const folder = S3_UPLOAD_FOLDER.MANUAL_TRANSACTIONS, extension = "jpg";
    let files = req.files
      .filter(file => file.fieldname == folder)
      .map(file => S3.upload(folder, extension, file.buffer, S3_ACL.PRIVATE));
    if (files) files = (await Promise.all(files)).map(file => file.replace(`${ folder }/`, "").replace(`.${ extension }`, ""));

    manual_transaction.attachments = files ? files : undefined;
    manual_transaction.execution = {
      reason: null,
      isExecuted: true,
      timestamp: new Date(),
      executor: user._id,
    };

    if (status === TRANSACTION_STATUS.SUCCESS) {

      query = FiatWallet.findOne({
        owner: manual_transaction.owner._id.toString(),
        currency_code: manual_transaction.currency_code,
        deleted_at: {
          $exists: false,
        },
      });

      wallet = await query;
      const balance = parseFloat(wallet.balance), quantity = parseFloat(manual_transaction.quantity);

      if (wallet && balance >= quantity) {

        wallet.balance = `${balance - quantity}`; // TODO: use BigNumber
        await wallet.save();

      } else {

        //Send an error containing not enough balance to do
        throw new HTTPError(STATUS_CODES.UNPROCESSABLE_ENTITY, ERROR.INSUFFICIENT_FUNDS);

      }

      manual_transaction.status = TRANSACTION_STATUS.SUCCESS;

    } else {

      manual_transaction.status = TRANSACTION_STATUS.FAILED;
      manual_transaction.reason = reason;

    }

    manual_transaction = await manual_transaction.save();
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
 * /v1/admin/manual-transactions/withdraw/{manual_transaction_id}/execute:
 *   patch:
 *     tags:
 *       - System User's Manual Transactions
 *     description: Execute System User's Withdraw Manual Transaction
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
 *         description: System User's Withdraw Manual Transaction executed successfully
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
