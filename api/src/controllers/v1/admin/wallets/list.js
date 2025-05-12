"use strict";

const validate = require("@root/src/middlewares/validator");
const { Wallet } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip, search } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");
const { MODEL } = require("@src/constants")
const { Types } = require('mongoose')
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
                            .valid(...Wallet.getSelectableFields()),
                    )
                    .default([]),
            }),
    }),
    async function listWalletsAdminV1Controller(req, res) {
        let {
            query: { page, limit, field, value },
        } = req;
        let {
            query: { select },
        } = req;

        let output
        if (field == 'owner' || field == 'id' || field == '_id')
            value = Types.ObjectId(value)
        output = search(field, value, MODEL.WALLET)
        const total_count = await Wallet.countDocuments(output),
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
        let wallets = [];

        let query = Wallet.find(output)
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

        wallets = await query;
        wallets = wallets.map((Wallet) => omit(Wallet.toJSON(), difference(toExcludeAfter, select)));

        res.json({
            wallets,
            meta,
        });

    },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
