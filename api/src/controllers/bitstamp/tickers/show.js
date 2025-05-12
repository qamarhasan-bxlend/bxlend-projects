"use strict";

const bodyParser = require("body-parser");
const { Ticker } = require("@root/src/models");
const { Joi } = require("@src/lib");
const { NotFound } = require("@src/errors");
const { auth } = require("@src/middlewares");



const CONTROLLER = [
  bodyParser.json(),
  
  async function getCurrencyPairsTickers(req, res) {
    const { params: { ticker_symbol } } = req;

    res.json({ticker : ticker_symbol});
  },
];

module.exports = CONTROLLER;
