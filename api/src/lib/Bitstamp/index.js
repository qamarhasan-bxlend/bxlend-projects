"use strict";

const {
    tickers
} = require('./tickers');
const {
    instantOrder
} = require('./orders')
const {
    marketTrades
} = require('./market_trades');

module.exports  = {
    getAllCurrencyPairsTicker : tickers.getAll,
    createInstantOrder : instantOrder.create,
    getCurrencyPairMarketTrades : marketTrades.get,
}