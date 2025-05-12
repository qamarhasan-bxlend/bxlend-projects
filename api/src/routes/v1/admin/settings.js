"use strict";

const { listSettingsAdminV1, updateSettingAdminV1, updateAdminSettingAdminV1, listAdminSettingsAdminV1 } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Country -------------------------

router.route("/application-setting")
  .get(wrapController(listSettingsAdminV1));

router.route("/")
  .get(wrapController(listAdminSettingsAdminV1));

router.route("/:setting_id")
  .patch(wrapController(updateAdminSettingAdminV1));

router.route("/")
  .put(wrapController(updateSettingAdminV1));

// ------------------------- Exports -------------------------

module.exports = Router().use("/settings", router);