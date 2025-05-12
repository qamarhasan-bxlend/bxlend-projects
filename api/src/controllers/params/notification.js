"use strict";

const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");
const { Notification } = require("@src/models");
const { Types } = require("mongoose");

async function notificationParamController(req, res, next) {
    const id = req.params.notification;

    if (!Types.ObjectId.isValid(id)) throw new Error('Not an ID');

    const notification = await Notification.findOne({
        _id: Types.ObjectId(id),
        deleted_at: { $exists: false },
    });

    if (notification == null) throw new NotFound(ERROR.NOTIFICATION_NOT_FOUND);

    req.params.notification = notification;

    next();
}

module.exports = notificationParamController;
