"use strict";

const bodyParser = require("body-parser");
const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const { auth } = require('@src/middlewares');
const { ERROR } = require("@src/constants");

const CONTROLLER = [
    auth(),
    bodyParser.json(),
    async function get2FA(req, res) {
        const { params: { user: userParam }, user } = req

        try {

            if (!user._id.equals(userParam._id))
                throw new Error(ERROR.FORBIDDEN)

            const secret = userParam.secret,
                email = userParam.email

            if (!secret) {
                throw new Error('Authenticator Secret not attached with User')
            }
            QRCode.toDataURL(authenticator.keyuri(email, '2FA Bxlend', secret), (err, url) => {
                if (err) {
                    throw err;
                }
                const qrUrl = url;
                res.status(200).send({ qrUrl: qrUrl })
            });
        }
        catch (error) {
            throw new Error(error.message)
        }
    }
];

module.exports = CONTROLLER;
