"use strict";

const { Router } = require("express");
const admin = require("./admin");
const client = require("./client");


const router = Router();

router
    .use(admin)
    .use(client)

module.exports = Router().use("/presale", router);