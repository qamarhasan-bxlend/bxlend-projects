"use strict";

const {
  requestForgotPassword,
  forgotPassword,
} = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");

//-----------------------------------Route----------------------------------------------- 

const router = Router();

router.route("/request-code")
  .post(wrapController(requestForgotPassword))

router.route("/:email")
  .post(wrapController(forgotPassword))

// -----------------------------------Exports----------------------------------------------

module.exports = Router().use("/forgot-password", router);
