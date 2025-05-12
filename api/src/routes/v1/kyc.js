"use strict";

const { createKycRequest, kycImageUpload, showKycStatus, kycImageDelete } = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

const router = Router();

// ------------------------- Params -------------------------

// ------------------------- Country -------------------------

router.route("/status").get(wrapController(showKycStatus));
router.route("/create-request").post(wrapController(createKycRequest));
router.route("/image-upload").post(wrapController(kycImageUpload));
router.route("/image-delete").post(wrapController(kycImageDelete));

// ------------------------- Exports -------------------------

module.exports = Router().use("/kyc", router);