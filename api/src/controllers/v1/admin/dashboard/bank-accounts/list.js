"use strict";

const validate = require("@root/src/middlewares/validator");
const { User, BankAccount } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { BANK_ACCOUNT_STATUS, DURATION } = require('@src/constants')
const { dashboardFilters } = require('../filter')


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
                            .valid(...BankAccount.getSelectableFields()),
                    )
                    .default([]),
            }),
    }),
    async function listBankAccountsDashboardAdminV1Controller(req, res) {
        const { duration } = req.body;
        let StatusCounts = [
            { "_id": BANK_ACCOUNT_STATUS.REJECTED, "count": 0 },
            { "_id": BANK_ACCOUNT_STATUS.SUSPENDED, "count": 0 },
            { "_id": BANK_ACCOUNT_STATUS.UNDER_REVIEW, "count": 0 },
            { "_id": BANK_ACCOUNT_STATUS.VERIFIED, "count": 0 },
        ]
        const STATUS = [BANK_ACCOUNT_STATUS.REJECTED, BANK_ACCOUNT_STATUS.SUSPENDED, BANK_ACCOUNT_STATUS.UNDER_REVIEW, BANK_ACCOUNT_STATUS.VERIFIED]
        const { total_count, model_count } = await dashboardFilters(StatusCounts, duration, BankAccount, STATUS)


        res.json({
            bank_accounts_count: model_count,
            total_count
        })
    }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;