"use strict";

const { listWaitingListUsersAdminV1, showWaitingListUserAdminV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listWaitingListUsersAdminV1));

router.route("/:waiting_list_users_id")
  .get(wrapController(showWaitingListUserAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/waiting-list-users", router);