"use strict";

const { verifyWaitingListUsersV1, verifyUserEmailV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Email Verification -------------------------

router.route("/email/verify/:token")
  .get(wrapController(verifyUserEmailV1));

  
router.route("/waiting-list-users/verify/:token")
.get(wrapController(verifyWaitingListUsersV1));

// ------------------------- Exports -----------------------------------

module.exports = Router().use("/verifications", router);
