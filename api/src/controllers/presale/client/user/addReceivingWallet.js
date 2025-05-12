
"use strict";

const validate = require("@src/middlewares/validator");
const {
    PresaleUser
} = require("@src/models");
const {
    STATUS_CODE
} = require("@src/constants");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const { showOrCreatePresaleUserService
} = require("@src/services");
const bodyParser = require("body-parser");

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    bodyParser.json(),
    validate({
        body: Joi
            .object()
            .keys({
                receiving_wallet: Joi.string().required().messages({
                    'any.required': "receiving wallet address is required",
                }),
            })
            .required(),
    }),
    async function updateReceivingWallet(req, res) {
        try {
            const { user, body: { receiving_wallet } } = req
            const presaleUser = await PresaleUser.findOne({
                user_id: user.id,
            })
            if (!presaleUser) {
                const newPU = await PresaleUser.create({
                    receiving_wallet: receiving_wallet,
                    user_id: user.id
                })
                // res.status(500).send({ message: "could not fetch pre-sale user" })
            } else {
                presaleUser.receiving_wallet = receiving_wallet;
                await presaleUser.save()
            }

            res.json({ message: "receiving wallet added successfully" })

        } catch (err) {
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                message : err?.message ?? err
            })

        }
    }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
