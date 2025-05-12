
"use strict";

const validate = require("@src/middlewares/validator");
const {
    STATUS_CODE
} = require("@src/constants");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const { PresaleUser } = require("@src/models");
const bodyParser = require("body-parser");
const { pageToSkip } = require("@src/utils/index");

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    adminAuth(),
    bodyParser.json(),
    validate({
        query: Joi
            .object()
            .keys({
                page: Joi
                    .number()
                    .integer()
                    .min(1)
                    .default(1),
                limit: Joi
                    .number()
                    .integer()
                    .min(1)
                    .default(10),
            }),
    }),

    async function listPresaleUsersAdminController(req, res) {
        try {
            const {
                query: { page, limit },
            } = req;
            let toSkip = pageToSkip(page, limit),
                toLimit = limit
            const presaleUsers = await PresaleUser.find().populate('user_id').skip(toSkip)
                .limit(toLimit)
            const total_count = await PresaleUser.countDocuments()
            let page_count = +Math.ceil(total_count / limit),
                meta = {
                    page,
                    limit,
                    page_count,
                    total_count,
                };
            if (!presaleUsers) {
                res.status(500).send({ message: "could not fetch pre-sale user" })
            }
            res.status(STATUS_CODE.OK).json({ presale_user: presaleUsers, meta })

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
