"use strict";

const { Joi } = require("@src/lib");
const { User } = require('@src/models')
const { validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { auth } = require('@src/middlewares');
const { authenticator } = require('otplib');

const CONTROLLER = [
    auth(),
    bodyParser.json(),
    validate({
        body: Joi
            .object()
            .keys({
                code: Joi
                    .string()
                    .required(),
            })
            .required(),
    }),
    async function post2FA(req, res) {
        const { body: { code }, params: { user: userParam }, user } = req
        try {
            if (!authenticator.check(code, userParam.secret)) {
                // redirect back
                throw new Error('Wrong Code');
            }
            else {
                user.twoFA_verified = true
                user.save()
                res.status(200).json({ msg: 'verified' })
            }

        } catch (error) {
            throw new Error(error.message)
        }
    }
];

module.exports = CONTROLLER;
