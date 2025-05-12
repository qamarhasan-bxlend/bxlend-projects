"use strict";

const validate = require("@root/src/middlewares/validator");
const { ManualDepositTransaction } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
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
            .valid(...ManualDepositTransaction.getSelectableFields()),
        )
        .default([]),
    }),
  }),
  async function showManualDepositTransactionAdminV1Controller(req, res) {
    const {
      params: { manual_transaction_id },
      query: { select },
    } = req;

    const toExcludeAfter = [];
    let manual_transaction;

    let query = ManualDepositTransaction.findOne({
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
 * /v1/admin/manual-transactions/deposit/{manual_transaction_id}:
 *   get:
 *     tags:
 *       - System User's Manual Transactions
 *     description: Show System User's Manual Deposit Transaction 
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/manual_transaction_id_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: System User's Manual Deposit Transaction fetched successfully
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