"use strict";

const validate = require("@root/src/middlewares/validator");
const { ManualDepositTransaction } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const multer = require("multer")();
const { omit, difference } = require("lodash");
const { TRANSACTION_STATUS, S3_UPLOAD_FOLDER, STATUS_CODE } = require("@src/constants");
const { S3_ACL } = require("@src/constants");
const { S3 } = require("@src/lib");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  multer.array(S3_UPLOAD_FOLDER.MANUAL_TRANSACTIONS,5),
  validate({
    body: Joi.object().keys({
      description: Joi.string().default(null),
      currency_code: Joi.string().required(),
      quantity: Joi.string().required(),
      to: Joi.string().required(),
    }).required(),
    query: Joi.object().keys({
      select: Joi.array()
        .items(
          Joi.string()
            .valid(...ManualDepositTransaction.getSelectableFields()),
        )
        .default([]),
    }),
  }),
  async function createManualDepositTransactionV1Controller(req, res) {

    const {
      user,
      query: { select },
      body,
    } = req;

    const folder = S3_UPLOAD_FOLDER.MANUAL_TRANSACTIONS, extension = "jpg";
    let files = req.files
      .filter(file=>file.fieldname==folder)
      .map(file=>S3.upload(folder,extension,file.buffer,S3_ACL.PRIVATE));
    files = (await Promise.all(files)).map(file=>file.replace(`${folder}/`,"").replace(`.${extension}`,""));

    const toExcludeAfter = [];
    let manual_transaction;

    let query = ManualDepositTransaction.create({
      owner: user._id,
      status: TRANSACTION_STATUS.PENDING,
      attachments:files,
      ...body,
    });

    manual_transaction = await query;
    manual_transaction = omit(manual_transaction.toJSON(), difference(toExcludeAfter, select));

    res.status(!manual_transaction?STATUS_CODE.NOT_FOUND:STATUS_CODE.OK).json({ manual_transaction });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/manual-transactions/deposit:
 *   post:
 *     tags:
 *       - Manual Transactions
 *     description: Create a Manual Deposit Transaction 
 *     security:
 *       - OpenID Connect:
 *     requestBody:
 *       required: true
 *       content: 
 *         multipart/form-data:
 *           schema:
 *             required:
 *               - currency_code
 *               - quantity
 *               - to
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
 *         description: Manual Deposit Transaction created
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