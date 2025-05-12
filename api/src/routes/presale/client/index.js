"use strict";

const { Router } = require("express");
const token_setups = require("./token_setup");
const transactions = require("./trasaction");
const users = require('./user')

const router = Router();

router
    .use(token_setups)
    .use(transactions)
    .use(users)

module.exports = Router().use("/client", router);