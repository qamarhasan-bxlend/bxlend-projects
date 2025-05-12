"use strict";

const { listBitgoWalletsAdminV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Country -------------------------

router.route("/")
  .get(wrapController(listBitgoWalletsAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/bitgo-wallets", router);