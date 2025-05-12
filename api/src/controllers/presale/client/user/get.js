
"use strict";

const validate = require("@src/middlewares/validator");
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
                referral_account: Joi.string().optional().allow(null),
                receiving_wallet: Joi.string().optional().allow(null),
            })
            .required(),
    }),
    async function showPresaleUser(req, res) {
        try {
            const { user, body: { referral_account, receiving_wallet } } = req
            const presaleUser = await showOrCreatePresaleUserService({ referral_account, receiving_wallet, user })
            if (!presaleUser) {
                res.status(500).send({ message: "could not fetch pre-sale user" })
            }

            res.json({ presale_user: presaleUser })

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
