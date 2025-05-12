"use strict";
const validate = require("@root/src/middlewares/validator");
const { Setting } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { ERROR, SETTING} = require("@src/constants");
const { NotFound } = require("@src/errors");

// ------------------------- Service -------------------------

const CONTROLLER = [
    auth(),
    adminAuth(),
    bodyParser.json(),
    validate({
        body: Joi.object()
            .keys({
                value: Joi.number().min(0).max(0.5).required(),
                name : Joi.string().valid(...Object.values(SETTING)).required(),
            })
    }),
    async function updateSettingAdminV1Controller(req, res) {
        const { value, name } = req.body
        try {
            await Setting.updateOne(
                { name },
                {
                    $set: { value },
                    $setOnInsert: { name },
                },
                { upsert: true },
            );
            res.status(200).send({ msg: "value updated" })
        }
        catch (error) {
            throw Error(ERROR.SETTING_COULDNOT_BE_UPDATED)
        }
    }
]
// ------------------------- Exports -------------------------

module.exports = CONTROLLER;
