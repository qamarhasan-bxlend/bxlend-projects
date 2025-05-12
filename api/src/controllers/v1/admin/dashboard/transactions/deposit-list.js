"use strict";

const validate = require("@root/src/middlewares/validator");
const { Transaction } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { TRANSACTION_STATUS, TRANSACTION_KIND, DURATION } = require('@src/constants');
const {dashboardFilters} = require('../filter')

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
    async function listDepositTransactionsDashboardAdminV1Controller(req, res) {
        const { duration } = req.body;
        let StatusCounts = [
            { "_id": TRANSACTION_STATUS.EXPIRED, "count": 0 },
            { "_id": TRANSACTION_STATUS.FAILED, "count": 0 },
            { "_id": TRANSACTION_STATUS.PENDING, "count": 0 },
            { "_id": TRANSACTION_STATUS.SUCCESS, "count": 0 },
        ]
        const STATUS = [TRANSACTION_STATUS.EXPIRED, TRANSACTION_STATUS.FAILED, TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.SUCCESS]
        const { total_count, model_count } = await dashboardFilters(StatusCounts, duration, Transaction, STATUS, TRANSACTION_KIND.DEPOSIT)

        res.json({
            total_count,
            deposit_transaction_count: model_count
        })
    }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;