"use strict";

const validate = require("@src/middlewares/validator");
const { adminAuth, auth } = require("@src/middlewares");
const {
    PresaleTokenSetup
} = require("@src/models");
const { Joi } = require("@src/lib");
const { STATUS_CODE } = require("@src/constants");
const bodyParser = require("body-parser");

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    adminAuth(),
    bodyParser.json(),
    validate({
        body: Joi.object()
            .keys({
                presale_token_id: Joi.string().objectId().required(), // The ID of the token setup to update
                minimum_deposit: Joi.object({
                    amount: Joi.number(),
                    currency: Joi.string(),
                }),
                total_tokens: Joi.number(),
                purchased_tokens: Joi.number(),
                queued_tokens: Joi.number(),
                base_price: Joi.number(),
                current_stage: Joi.number(),
                supported_payment_options: Joi.array().items(
                    Joi.object({
                        supported_coins: Joi.array().items(Joi.string()),
                        blockchain: Joi.string(),
                        deposit_address: Joi.string(),
                    })
                ),
                base_price_for_each_stage: Joi.array().items(
                    Joi.object({
                        stage: Joi.number(),
                        triggering_amount: Joi.number(),
                        price_increment: Joi.number(),
                    })
                ),
                discounts: Joi.array().items(
                    Joi.object({
                        minimum_buy: Joi.number(),
                        discount: Joi.number(),
                    })
                ),
            })
            .required(),
    }),
    async function updateTokenSetupV1Controller(req, res) {
        try {
            const { presale_token_id, ...updateFields } = req.body;

            const updatedTokenSetup = await PresaleTokenSetup.findOneAndUpdate(
                { _id: presale_token_id, deleted_at: { $exists: false } },
                { $set: updateFields },
                { new: true }
            );

            if (!updatedTokenSetup) {
                return res
                    .status(STATUS_CODE.NOT_FOUND)
                    .json({ message: "Presale token setup not found" });
            }

            res.json({ token_setup: updatedTokenSetup });
        } catch (err) {
            console.error(err);
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                message: err?.message ?? "Internal Server Error",
            });
        }
    },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
