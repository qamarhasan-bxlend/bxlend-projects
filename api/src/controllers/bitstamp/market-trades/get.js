"use strict";
const { MarketTrades } = require("@src/models")

const CONTROLLER = [
    async function getCurrencyPairsMarketTrades(req, res) {
        const {
            params: { market_trade_symbol }
        } = req
        try {
            const data = await MarketTrades.find({
                symbol: market_trade_symbol.toLowerCase()
            }, { trades: 1, _id: 0 })
            res.send(data[0].trades)
        }
        catch (error) {
            console.log(error)
            throw error
        }

    },
];

module.exports = CONTROLLER;
