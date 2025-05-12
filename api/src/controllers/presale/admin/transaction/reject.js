"use strict";

const validate = require("@src/middlewares/validator");
const {
    PresaleUser,
    PresaleTokenSetup,
    PresaleTransaction,
    Notification
} = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { Forbidden } = require("@src/errors");
const {
    ERROR,
    STATUS_CODE,
    PRESALE_TRANSACTION_STATUS,

} = require("@src/constants");
const { DBTransaction } = require("@src/utils");

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    adminAuth(),
    bodyParser.json(),
    validate({
        body: Joi.object()
            .keys({
                transaction_id: Joi.string().objectId().required(),
            })
            .required(),
    }),
    async function rejectPresaleTokenTransaction(req, res) {
        const DBT = await DBTransaction.init();

        try {
          
            const { transaction_id } = req.body;
            const presaleTokenSetup = await PresaleTokenSetup.findOne();
            if (!presaleTokenSetup) {
                return res.status(STATUS_CODE.NOT_FOUND).json({
                    error: ERROR.NOT_FOUND,
                    message: "Presale token setup not found.",
                });
            }
            const transaction = await PresaleTransaction.findOne({
                _id: transaction_id,
                $or: [
                    { status: PRESALE_TRANSACTION_STATUS.INPROGRESS },
                    { status: PRESALE_TRANSACTION_STATUS.PENDING }
                ]
            });

            if (!transaction) {
                return res.status(STATUS_CODE.CONFLICT).json({
                    error: "Transaction not found or already rejected",
                    message: "Transaction not found or alredy rejected"
                })
            }

            transaction.status = PRESALE_TRANSACTION_STATUS.REJECTED
            await transaction.save(DBT.mongoose());

            presaleTokenSetup.queued_tokens -= transaction.tokens_allocation.total;
            await presaleTokenSetup.save(DBT.mongoose());

            const presaleUser = await PresaleUser.findOne({
                user_id: transaction.user_id
            })
          
            presaleUser.pending_allocation -= transaction.tokens_allocation.total;
            await presaleUser.save(DBT.mongoose());

            await Notification.create({
                user: transaction.user_id,
                message: `Your Presale transaction with transaction id: ${transaction._id} has been rejected.`,
                title: 'Presale Transaction Confirmed'
            })

            await DBT.commit();
            return res.status(STATUS_CODE.OK).json({
                message: "Transaction rejected successfully.",
                // data: { transaction },
            });

            //send Email to customer for rejection of transaction
            // sendEmail({})

        } catch (error) {
            console.error("Error rejecting transaction:", error);
            await DBT.abort();
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                error: ERROR.INTERNAL_SERVER_ERROR,
                message: error.message //"Failed to update transaction.",
            });
        }
    },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
