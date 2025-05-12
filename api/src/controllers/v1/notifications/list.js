const { Notification } = require('@src/models');
const { auth } = require('@src/middlewares');
const bodyParser = require('body-parser');
const { Joi } = require('@src/lib');
const { pageToSkip } = require("@src/utils/index");
const { union } = require("lodash");
const validate = require('@src/middlewares/validator');

const CONTROLLER = [
    auth(),
    bodyParser.json(),
    validate({
        query: Joi.object().keys({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).default(10),
            select: Joi.array().items(
                Joi.string().valid(...Notification.getSelectableFields())
            )
        })
    }),
    async function listUserNotifications(req, res) {
        const {
            user,
            query: { page, limit, select }
        } = req;

        const filter = {
            user: user._id,
            deleted_at: {
                $exists: false,
            },
        };

        const total_count = await Notification.countDocuments(filter);

        let notifications = [];
        let toSkip = pageToSkip(page, limit);
        let toLimit = limit;
        let page_count = Math.ceil(total_count / limit);

        if (total_count > 0) {
            notifications = await Notification.find(filter)
                .select(union(select, ['created_at', '_id', 'title', 'message', 'readStatus']))
                .sort({ created_at: -1 })
                .skip(toSkip)
                .limit(toLimit);
        }

        res.json({
            notifications,
            meta: {
                page,
                limit,
                page_count,
                total_count,
            }
        });
    }
];

module.exports = CONTROLLER;
