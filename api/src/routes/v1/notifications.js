"use strict";

const {
  listUserNotifications,notificationParam,updateNotificationReadStatusV1,listUserNotificationsCount
} = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();
// ------------------------- Params ------------------------------
router.param("notification",wrapController(notificationParam)) 

// ------------------------- Notification -------------------------

router.route("/").get(wrapController(listUserNotifications));
router.route("/total-count").get(wrapController(listUserNotificationsCount))

router.route("/:notification").put(wrapController(updateNotificationReadStatusV1))


// ------------------------- Exports -------------------------

module.exports = Router().use("/notifications", router);
