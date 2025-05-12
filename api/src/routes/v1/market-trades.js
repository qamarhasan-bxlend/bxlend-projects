"use strict"
const { Router } =require('express')
const {wrapController} = require('@src/utils')
const {getCurrencyPairMarketTrades, marketTradeParam} = require("@src/controllers")

const router = Router()

// ------------------------- Params -------------------------

router.param("market_trade_symbol", wrapController(marketTradeParam));

// ------------------------- Tickers -------------------------

router.route('/:market_trade_symbol').get(wrapController(getCurrencyPairMarketTrades))

// ------------------------- Exports -------------------------
module.exports = Router().use('/market-trades',router)

