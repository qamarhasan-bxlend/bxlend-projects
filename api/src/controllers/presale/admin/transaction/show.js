
"use strict";
const {
    PresaleTransaction
} = require("@src/models");
const {
    STATUS_CODE
} = require("@src/constants");
const bodyParser = require("body-parser");
const { auth, adminAuth, validate } = require('@src/middlewares')
const { Joi } = require('@src/lib')

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    adminAuth(),
    bodyParser.json(),
    validate({
        params: Joi
            .object()
            .keys({
                presale_transaction_id: Joi.string().objectId().required().messages({
                    'any.required': "presale transaction id is required",
                }),
            })
            .required(),
    }),
    async function listPresaleTransactionsController(req, res) {
        try {
            const { presale_transaction_id } = req.params
            const presaleTransactions = await PresaleTransaction.findOne({
                deleted_at: { $exists: false },
                _id: presale_transaction_id
            }).populate('user_id')
            if (!presaleTransactions) {
                return res.status(500).send({ message: "could not fetch tokens' setup" })
            }
            const transaction = {
                _id: presaleTransactions._id,
                user: presaleTransactions.user_id,
                status: presaleTransactions.status,
                deposit_address: presaleTransactions?.deposit_address,
                order_number: transaction.transaction_number,
                discount: presaleTransactions?.discount,
                "amount_in_usd": presaleTransactions.amount_in_usd,
                "bxlend_token_base_price": presaleTransactions.bxt_base_price,
                "blockchain_presaleTransactions_id": presaleTransactions.blockchain_transaction_id,
                "blockchain": presaleTransactions.blockchain,
                "payment_coin": presaleTransactions.payment_coin,
                "payment_screenshot": presaleTransactions.payment_screenshot,
                "coin_price": presaleTransactions.coin_price_at_order_time.coin_price,
                "coin_converted_price": presaleTransactions.coin_price_at_order_time.converted_price,
                "token_allocation": presaleTransactions.tokens_allocation.total,
                "presale_stage": presaleTransactions.presale_stage,
            }
            res.json({ presale_transaction: transaction })

        } catch (err) {
            console.log(err)
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                message: err?.message ?? err
            })
        }
    }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
