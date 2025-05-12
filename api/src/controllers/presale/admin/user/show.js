
"use strict";

const validate = require("@src/middlewares/validator");
const {
    STATUS_CODE
} = require("@src/constants");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const { PresaleUser } = require("@src/models");
const bodyParser = require("body-parser");
const { CAST_ERROR } = require("mongoose");

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    adminAuth(),
    bodyParser.json(),
    validate({
        params: Joi
            .object()
            .keys({
                presale_user_id: Joi.string().objectId().required().messages({
                    'any.required': "presale user id is required",
                }),
            })
            .required(),
    }),
    async function showPresaleUsersAdminController(req, res) {
        try {
            const { presale_user_id } = req.params
            const presaleUser = await PresaleUser.findById(presale_user_id).populate('user_id')
            if (!presaleUser) {
                res.status(500).send({ message: "could not fetch pre-sale user" })
            }
            res.status(STATUS_CODE.OK).json({ presale_user: presaleUser })

        } catch (err) {
            console.log(err)
            if (err.name === "CastError") {
                return res.status(400).json({
                    message: "Invalid presale user id format",
                    error: "Invalid presale user id format",
                });
            }
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                message: err?.message ?? err
            })

        }
    }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
