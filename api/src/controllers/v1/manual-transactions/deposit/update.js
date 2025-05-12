"use strict";

const validate = require("@root/src/middlewares/validator");
const { ManualDepositTransaction } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const multer = require("multer")();
const { omit, difference } = require("lodash");
const { ERROR, TRANSACTION_STATUS, S3_UPLOAD_FOLDER } = require("@src/constants");
const { NotFound } = require("@src/errors");
const { S3_ACL } = require("@src/constants");
const { S3 } = require("@src/lib");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  multer.array(S3_UPLOAD_FOLDER.MANUAL_TRANSACTIONS,5),
  validate({
    body: Joi.object().keys({
      description: Joi.string(),
      currency_code: Joi.string(),
      quantity: Joi.string(),
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
  async function updateManualDepositTransactionV1Controller(req, res) {
    const {
      user,
      query: { select },
      params: { manual_transaction_id },
      body,
    } = req;

    const folder = S3_UPLOAD_FOLDER.MANUAL_TRANSACTIONS, extension = "jpg";
    let files = req.files
      .filter(file=>file.fieldname==folder)
      .map(file=>S3.upload(folder,extension,file.buffer,S3_ACL.PRIVATE));
    if(files) files = (await Promise.all(files)).map(file=>file.replace(`${folder}/`,"").replace(`.${extension}`,""));

    const toExcludeAfter = [];
    let manual_transaction;

    let query = ManualDepositTransaction.updateOne({
      _id: manual_transaction_id,
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    },{
      $set:{
        status: TRANSACTION_STATUS.PENDING,
        attachments:files?files:undefined,
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

    query = ManualDepositTransaction.findOne({
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
 * /v1/manual-transactions/deposit/{manual_transaction_id}:
 *   patch:
 *     tags:
 *       - Manual Transactions
 *     description: Update a Manual Deposit Transaction 
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/manual_transaction_id_parameter"
 *     requestBody:
 *       required: true
 *       content: 
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               currency_code:
 *                 type: string
 *               quantity:
 *                 type: string
 *               to:
 *                 type: string
 *               attachments:
 *                 type: string
 *                 format: binary
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Manual Deposit Transaction updated
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