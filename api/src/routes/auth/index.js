"use strict";

const { NODE_ENV } = require("@src/config");
const { ENV } = require("@src/constants");
const { Router } = require("express");
const interactionRoutes = require("./interaction");
const forgotPassword = require('./forgot-password')

// TODO: make separate service!

const router = Router();

// ------------------------- Routes ---------------------------------

// TODO: temporary, remove after making auth, a separate service
/* istanbul ignore next */
if (NODE_ENV === ENV.PRODUCTION) {
  router.use((req, res, next) => {
    // if (API_URI === `${req.protocol}://${req.headers.host}`) return next(new NotFound());

    req.baseUrl = "";
    req.originalUrl = req.originalUrl.replace(/^\/auth/, "");

    next();
  });
}

router.use(interactionRoutes);
router.use(forgotPassword)


// ------------------------- Exports --------------------------------

module.exports = Router().use("/auth", router);
