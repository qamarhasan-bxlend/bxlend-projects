"use strict"
const { Router } =require('express')
const {wrapController} = require('@src/utils')
const {deleteTickersDocuments, getCurrencyPairsTickers, showCurrencyPairsTickers, tickerSymbolParam} = require("@src/controllers")

const router = Router()

// ------------------------- Params -------------------------

router.param("ticker_symbol", wrapController(tickerSymbolParam));

// ------------------------- Tickers -------------------------

router.route('/').get(wrapController(getCurrencyPairsTickers))

router.route('/:ticker_symbol').get(wrapController(showCurrencyPairsTickers))

router.route('/delete').delete(wrapController(deleteTickersDocuments))

// ------------------------- Exports -------------------------
module.exports = Router().use('/tickers',router)

