"use strict";

const { showUserAdminV1, listUsersAdminV1, changeUserStatusAdminV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listUsersAdminV1));

router.route("/:user_id")
  .get(wrapController(showUserAdminV1));

router.route("/:user_id")
  .patch(wrapController(changeUserStatusAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/users", router);