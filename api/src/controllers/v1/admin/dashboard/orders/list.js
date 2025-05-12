"use strict";

const validate = require("@root/src/middlewares/validator");
const { Order } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { ORDER_STATUS, DURATION } = require('@src/constants')
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
                            .valid(...Order.getSelectableFields()),
                    )
                    .default([]),
            }),
    }),
    async function listOrdersDashboardAdminV1Controller(req, res) {
        const { duration } = req.body;
        let StatusCounts = [
            { "_id": ORDER_STATUS.ACTIVE, "count": 0 },
            { "_id": ORDER_STATUS.CANCELLED, "count": 0 },
            { "_id": ORDER_STATUS.FAILED, "count": 0 },
            { "_id": ORDER_STATUS.FULFILLED, "count": 0 },
            { "_id": ORDER_STATUS.PENDING, "count": 0 },
        ]
        const STATUS = [ORDER_STATUS.ACTIVE, ORDER_STATUS.CANCELLED, ORDER_STATUS.FAILED, ORDER_STATUS.FULFILLED, ORDER_STATUS.PENDING];
        const { total_count, model_count } = await dashboardFilters(StatusCounts, duration, Order, STATUS)
    
        res.json({
            total_count,
            orders_count : model_count  // Include statusCounts in the response
        })
    }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;