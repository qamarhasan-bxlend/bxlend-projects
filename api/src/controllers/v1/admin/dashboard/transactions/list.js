"use strict";

const validate = require("@root/src/middlewares/validator");
const { Transaction } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { TRANSACTION_STATUS, DURATION } = require('@src/constants');
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
                            .valid(...Transaction.getSelectableFields()),
                    )
                    .default([]),
            }),
    }),
    async function listTransactionsDashboardAdminV1Controller(req, res) {
        const { duration } = req.body;
        let StatusCounts = [
            { "_id": TRANSACTION_STATUS.EXPIRED, "count": 0 },
            { "_id": TRANSACTION_STATUS.FAILED, "count": 0 },
            { "_id": TRANSACTION_STATUS.PENDING, "count": 0 },
            { "_id": TRANSACTION_STATUS.SUCCESS, "count": 0 },
        ]

        const match = {
            deleted_at: { $exists: false },
        };
        const model_count = await kycDashboardFilter(duration, match, Transaction, StatusCounts)

        res.json({
            // total_count,
            transaction_count: model_count,
        })
    }
];
// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;