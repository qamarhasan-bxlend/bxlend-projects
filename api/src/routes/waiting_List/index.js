"use strict";

const { Router } = require("express");
const register = require("./register");

// TODO: make separate service!

const router = Router();

// ------------------------- Routes ---------------------------------

router.use(register);

// ------------------------- Exports --------------------------------

module.exports = Router().use("/waiting-list", router);
