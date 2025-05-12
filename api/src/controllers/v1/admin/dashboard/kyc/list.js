"use strict";

const validate = require("@root/src/middlewares/validator");
const { Kyc } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { DURATION } = require('@src/constants')
const { kycDashboardFilter } = require('../filter')
// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    adminAuth(),
    bodyParser.json(),
    validate({
        body: Joi
            .object()
            .keys({
                duration: Joi
                    .string()
                    .valid(...Object.values(DURATION))
                    .default(DURATION.MONTHLY)
            }),
        query: Joi
            .object()
            .keys({
                page: Joi
                    .number()
                    .integer()
                    .min(1),
                limit: Joi
                    .number()
                    .integer()
                    .min(1),
                select: Joi
                    .array()
                    .items(
                        Joi
                            .string()
                            .valid(...Kyc.getSelectableFields()),
                    )
                    .default([]),
            }),
    }),
    async function listKycDashboardAdminV1Controller(req, res) {
        const { duration } = req.body;

        let kyc_count = [];
        const match = {
            deleted_at: { $exists: false },
        };

        kyc_count = await kycDashboardFilter(duration, match, Kyc)
        const total_count = kyc_count.reduce((total, period) => total + period.count, 0);

        res.json({
            kyc_count,
            total_count,
        });
    }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
