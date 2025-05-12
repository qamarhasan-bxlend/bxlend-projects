"use strict";

const validate = require("@root/src/middlewares/validator");
const { WaitingListUser } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip,search } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");


// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    adminAuth(),
    bodyParser.json(),
    validate({
        query: Joi
            .object()
            .keys({
                field: Joi
                    .string(),
                value: Joi
                    .string(),
                page: Joi
                    .number()
                    .integer()
                    .min(1)
                    .default(1),
                limit: Joi
                    .number()
                    .integer()
                    .min(1)
                    .max(100)
                    .default(10),
                select: Joi
                    .array()
                    .items(
                        Joi
                            .string()
                            .valid(...WaitingListUser.getSelectableFields()),
                    )
                    .default([]),
            }),
    }),
    async function listWaitingListUsersAdminV1Controller(req, res) {
        const {
            query: { page, limit, field, value },
        } = req;
        let {
            query: { select },
        } = req;

        let output
        output = search(field, value)

        const total_count = await WaitingListUser.countDocuments(output),
            toBePopulated = [],
            toIncludeBefore = [],
            toExcludeAfter = [],
            toSkip = pageToSkip(page, limit),
            toLimit = limit,
            page_count = +Math.ceil(total_count / limit),
            meta = {
                page,
                limit,
                page_count,
                total_count,
            };

        let waitingListUsers = [];

        let query = WaitingListUser.find(output)
            .select(union(select, toIncludeBefore))
            .skip(toSkip)
            .limit(toLimit)
            .sort({ 'created_at': -1 })

        toBePopulated.forEach(populate => {
            if (select.length && select.includes(populate.path)) {
                query.populate(populate);
            } else if (!select.length) {
                query.populate(populate);
            }
        });

        waitingListUsers = await query;
        waitingListUsers = waitingListUsers.map((waitingListUser) => omit(waitingListUser.toJSON(), difference(toExcludeAfter, select)));

        res.json({
            waitingListUsers,
            meta,
        });

    },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
