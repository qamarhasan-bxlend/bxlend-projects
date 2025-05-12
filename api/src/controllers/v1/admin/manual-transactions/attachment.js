"use strict";

const validate = require("@root/src/middlewares/validator");
const { Transaction } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth , adminAuth} = require("@src/middlewares");
const bodyParser = require("body-parser");
const { ERROR, TRANSACTION_KIND } = require("@src/constants");
const { NotFound } = require("@src/errors");
const { S3 } = require("@src/lib");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  adminAuth(),
  auth(),
  bodyParser.json(),
  validate({
    params: Joi.object()
      .keys({
        manual_transaction_id: Joi.string().required(),
        attachment_id: Joi.string().required(),
      })
      .required(),
  }),
  async function showManualTransactionAttachmentV1Controller(req, res) {
    const {
      params: { attachment_id, manual_transaction_id },
    } = req;

    let manual_tranasction;

    const query = Transaction.findOne({
      $or:[
        {
          kind: TRANSACTION_KIND.MANUAL_DEPOSIT,
        },
        {
          kind: TRANSACTION_KIND.MANUAL_WITHDRAW,
        },
      ],
      attachments: {
        $elemMatch: {
          $eq: attachment_id,
        },
      },
      _id: manual_transaction_id,
      deleted_at: {
        $exists: false,
      },
    });

    manual_tranasction = await query;
    if (!manual_tranasction) throw new NotFound(ERROR.TRANSACTION_NOT_FOUND);

    const data = await S3.downloadAtOnce(`manual_transactions/${attachment_id}.jpg`);
    res.send(data);
    
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/admin/manual-transactions/{manual_transaction_id}/attachment/{attachment_id}:
 *   patch:
 *     tags:
 *       - System User's Manual Transactions
 *     description: Show Manual Transaction's attachment ( either deposit or withdraw )
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/manual_transaction_id_parameter"
 *       - $ref: "#/parameters/attachment_id_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Manual Transaction's attachment fetched successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         $ref: "#/responses/401"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */