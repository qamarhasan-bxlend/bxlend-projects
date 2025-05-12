
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
const { generatePresaleTransactionNumber } = require('@src/services')

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    bodyParser.json(),
    validate({
        body: Joi
            .object()
            .keys({
                amount_in_usd: Joi.string().required().messages({
                    'any.required': "amount is required",
                }),
                discount_amount: Joi.number().required().messages({
                    'any.required': "discount amount is required",
                }),
                bxt_base_price: Joi.string().required().messages({
                    'any.required': "coin base price is required",
                }),
                presale_stage: Joi.string().required().messages({
                    'any.required': "presale_stage is required",
                }),
                blockchain: Joi.string().required().messages({
                    'any.required': "blockchain is required",
                }),
                payment_coin: Joi.string().required().messages({
                    'any.required': "coin is required",
                }),
                tokens_allocation: Joi.object({
                    discounted: Joi.number().required().messages({
                        "any.required": "Discounted tokens are required",
                    }),
                    base: Joi.number().required().messages({
                        "any.required": "Base tokens are required",
                    }),
                    total: Joi.number().required().messages({
                        "any.required": "Total tokens are required",
                    }),
                }).required(),
                coin_price: Joi.number().required().messages({
                    'any.required': "coin price is required",
                }),
                converted_price: Joi.number().required().messages({
                    'any.required': "converted price is required",
                })
                // .max(50000),
            })
            .required(),
    }),
    async function createPresaleTokenTransaction(req, res) {
        try {
            const { user, body: { amount_in_usd, blockchain, payment_coin, tokens_allocation, bxt_base_price, presale_stage, discount_amount, coin_price, converted_price } } = req
            if (tokens_allocation.base > 50000) {
                return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
                    message: "Cannot buy more than 50,000 tokens per transactions"
                })
            }
            console.log(req.body)
            const presaleUser = await PresaleUser.findOne({
                user_id: user._id
            })
            if (!presaleUser) {
                return res.status(409).send({ message: "could not fetch presale user" })
            }
            else {
                const transaction_number = await generatePresaleTransactionNumber();
                const presaleTokenSetup = await PresaleTokenSetup.findOne()
                if (!presaleTokenSetup) {
                    return res.status(500).json({ message: "token config error. contact customer support" })
                }
                if ((presaleTokenSetup.queued_tokens + presaleTokenSetup.purchased_tokens + tokens_allocation.total > presaleTokenSetup.total_tokens)) {
                    return res.status(400).json({ message: "token limit reached" })
                }

                let findDepositAddress = null;

                if (presaleTokenSetup?.supported_payment_options) {
                    findDepositAddress = presaleTokenSetup.supported_payment_options.find(
                        (supported_payment) => supported_payment.blockchain === blockchain
                    )?.deposit_address;
                }

                if (!findDepositAddress) {
                    return res.status(409).json({ message: "No deposit address for this blockchain" });
                }
                const totalTransactions = await PresaleTransaction.countDocuments({
                    presale_user_id: presaleUser._id,
                    $or: [
                        {
                            status: PRESALE_TRANSACTION_STATUS.PENDING,
                        },
                        {
                            status: PRESALE_TRANSACTION_STATUS.INPROGRESS
                        }
                    ]
                })
                if (totalTransactions >= 2) {
                    return res.status(409).json({ message: "You currently have two pending transactions. Please mark them as paid or canceled to proceed, and wait for any in-progress transactions to be approved." });
                }

                const newTransaction = await PresaleTransaction.create({
                    presale_user_id: presaleUser._id,
                    user_id: user.id,
                    amount_in_usd: amount_in_usd,
                    transaction_number: transaction_number,
                    blockchain: blockchain,
                    payment_coin: payment_coin,
                    deposit_address: findDepositAddress,
                    tokens_allocation: tokens_allocation,
                    bxt_base_price: bxt_base_price,
                    discount_amount: discount_amount,
                    presale_stage: presale_stage,
                    "coin_price_at_order_time": {
                        "coin_price": coin_price,
                        "converted_price": converted_price
                    }
                })
                presaleTokenSetup.queued_tokens = presaleTokenSetup.queued_tokens + tokens_allocation.total;
                await presaleTokenSetup.save()

                presaleUser.pending_allocation = presaleUser.pending_allocation + tokens_allocation.total
                await presaleUser.save()
                const data = {
                    transaction_number: newTransaction.transaction_number,
                    deposit_address: findDepositAddress
                }
                return res.status(200).send(data)
            }

        } catch (err) {
            console.log(err ?? err.message)
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                message: err.message
            })

        }
    }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
