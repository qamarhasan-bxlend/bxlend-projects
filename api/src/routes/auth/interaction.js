"use strict";

const {
  getInteraction,
  loginInteraction,
  confirmInteraction,
  abortInteraction,
  getRegisterInteraction,
  registerInteraction,
} = require("@src/controllers");
const { wrapController } = require("@src/utils");
const { Router } = require("express");
const helmet = require('helmet')
const router = Router();
const cspUpdate = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "https://js.hcaptcha.com"],
        scriptSrc: ["'self'", "https://js.hcaptcha.com"],
        frameSrc: [
          "'self'", 
          "https://js.hcaptcha.com", 
          "https://hcaptcha.com", 
          "https://*.hcaptcha.com"
        ],
        imgSrc: ["'self'", "data:"], // Allow inline SVGs
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for SVGs
      },
    },
  });
};



router
  .use(cspUpdate())
  .route("/:uid")
  .get(wrapController(getInteraction));

router
  .use(cspUpdate())
  .route("/:uid/login")
  .post(wrapController(loginInteraction));

router.route("/:uid/register")
  .get(wrapController(getRegisterInteraction))
  .post(wrapController(registerInteraction));

router.route("/:uid/confirm")
  .post(wrapController(confirmInteraction));

router.route("/:uid/abort")
  .get(wrapController(abortInteraction));

module.exports = Router().use("/interaction", router);
