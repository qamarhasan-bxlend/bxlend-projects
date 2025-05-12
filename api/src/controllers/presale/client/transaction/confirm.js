"use strict";

const validate = require("@src/middlewares/validator");
const {
    PresaleUser,
    PresaleTokenSetup,
    PresaleTransaction,
} = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { S3 } = require("@src/lib");
const multer = require("multer")();
const { S3_ENDPOINT, S3_BUCKET } = require("@src/config");
const { Forbidden } = require("@src/errors");
const {
    ERROR,
    STATUS_CODE,
    PRESALE_TRANSACTION_STATUS,
    S3_ACL,
    S3_UPLOAD_FOLDER,
    SUPPORTED_IMAGE_FORMATS,
} = require("@src/constants");

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    multer.single("presale_transaction"),
    bodyParser.json(),
    validate({
        body: Joi.object()
            .keys({
                transaction_id: Joi.string().objectId().required(),
                blockchain_transaction_id: Joi.string().required(),
            })
            .required(),
    }),
    async function updatePresaleTokenTransaction(req, res) {
        try {
            const { user } = req
            const { transaction_id, blockchain_transaction_id } = req.body;
            const file = req.file;
            const transaction = await PresaleTransaction.findOne({
                _id : transaction_id,
                status : PRESALE_TRANSACTION_STATUS.PENDING
            });
            if (!transaction) {
                return res.status(STATUS_CODE.CONFLICT).json({
                    error : "Transaction not found or already inprogress",
                    message : "Transaction not found or already inprogress"
                })
            }

            if (!file) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({
                    error: "No file uploaded.",
                    message: "No file uploaded.",
                });
            }

            const metadata = { user: user.id };
            const folder = S3_UPLOAD_FOLDER.PRESALE_TRANSACTION
            const extension = SUPPORTED_IMAGE_FORMATS.JPEG;
            const buffer = await S3.prepareForS3Upload(file.buffer);
            const filePath = await S3.upload(
                folder,
                extension,
                buffer,
                S3_ACL.PUBLIC,
                metadata
            );

            

            transaction.payment_screenshot = `${S3_ENDPOINT}/${S3_BUCKET}/${filePath}`;
            transaction.blockchain_transaction_id = blockchain_transaction_id
            transaction.status = PRESALE_TRANSACTION_STATUS.INPROGRESS
            await transaction.save();

            return res.status(STATUS_CODE.OK).json({
                message: "Transaction updated successfully.",
                data: { transaction },
            });
        } catch (error) {
            console.error("Error updating transaction:", error);
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                error: ERROR.INTERNAL_SERVER_ERROR,
                message: error.message //"Failed to update transaction.",
            });
        }
    },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
