"use strict"
const { Router } =require('express')
const {wrapController} = require('@src/utils')
const  {getCurrencyPairsTickers} = require("@src/controllers")

const router = Router()

// ------------------------- Tickers -------------------------

router.route('/').get(wrapController(getCurrencyPairsTickers))

// ------------------------- Exports -------------------------
module.exports = Router().use('/currency-pairs',router)
