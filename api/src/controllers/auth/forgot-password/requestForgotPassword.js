"use strict";

const { Joi } = require("@src/lib");
const { validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { requestPasswordResetOTP } = require('@src/services')

const CONTROLLER = [
    bodyParser.json(),
    validate({
        body: Joi
            .object()
            .keys({
                email: Joi
                    .string()
                    // .required(),
            })
    }),
    async function requestForgotPassword(req, res) {

        const { email } = req.body;
        try {
            const user = await requestPasswordResetOTP(email)
            if (!user) {
                throw new Error('User does not exist')
            }
            res.status(200).json({
                message: 'email sent'
            })
        }
        catch (error) {
            console.log(error)
            throw new Error(error.message)
        }
    },
];

module.exports = CONTROLLER;
