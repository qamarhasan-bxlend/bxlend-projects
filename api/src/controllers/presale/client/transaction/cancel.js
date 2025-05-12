
"use strict";

const validate = require("@src/middlewares/validator");
const {
    PresaleUser,
    PresaleTokenSetup,
    PresaleTransaction
} = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { PRESALE_TRANSACTION_STATUS, STATUS_CODE } = require("@src/constants");

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    bodyParser.json(),
    validate({
        body: Joi
            .object()
            .keys({
                transaction_id: Joi.string().required().messages({
                    'any.required': "transaction id is required",
                }),
            })
            .required(),
    }),
    async function cancelPresaleTokenTransaction(req, res) {
        try {
            const { user, body: { transaction_id } } = req
            const findTransaction = await PresaleTransaction.findOne({
                _id: transaction_id
            })
            const presaleUser = await PresaleUser.findOne({
                user_id: user._id
            })
            if (!findTransaction) {
                return res.status(409).json({ message: "transaction not found" })
            }
            if (findTransaction.status == PRESALE_TRANSACTION_STATUS.COMPLETED) {
                return res.status(409).json({ message: "transaction cannot be canceled" })
            }
            if (findTransaction.status == PRESALE_TRANSACTION_STATUS.CANCELED) {
                return res.status(409).json({ message: "transaction already canceled" })
            }
            const presaleTokenSetup = await PresaleTokenSetup.findOne()
            if (!presaleTokenSetup) {
                return res.status(500).json({ message: "token config error. contact customer support" })
            }
            presaleTokenSetup.queued_tokens = presaleTokenSetup.queued_tokens - findTransaction.tokens_allocation.total

            await presaleTokenSetup.save()
            findTransaction.status = PRESALE_TRANSACTION_STATUS.CANCELED
            await findTransaction.save()
            presaleUser.pending_allocation = presaleUser.pending_allocation - findTransaction.tokens_allocation.total
            await presaleUser.save()
            return res.status(200).json({ message: "transaction cancelled successfully" })

        } catch (err) {
            console.log(err)
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                message: err.message
            })
        }
    }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
