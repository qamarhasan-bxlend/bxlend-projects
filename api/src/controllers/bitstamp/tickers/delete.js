"use strict";

const validate = require("@root/src/middlewares/validator");
const { Joi, CryptoApis } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { ERROR, STATUS_CODE } = require("@src/constants");
const { Ticker, CurrencyPair } = require("@root/src/models");
const { NotFound } = require("@src/errors");
const { Bitstamp } = require("@src/lib");

const CONTROLLER = [
  async function deleteTickersDocuments(req, res) {
        await Ticker.deleteMany({},(err)=>{
            if(err){
                console.error('Error deleting documents:', err);
              } else {
                console.log('All documents deleted successfully');
              }
        })
    res.json({
      msg : "Tickers deleted"
    })
  },
];

module.exports = CONTROLLER;
