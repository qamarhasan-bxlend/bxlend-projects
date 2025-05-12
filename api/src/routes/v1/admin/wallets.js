"use strict";

const { listWalletsAdminV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listWalletsAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/wallets", router);
