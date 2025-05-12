"use strict";

const { Ticker, CurrencyPair, MarketTrades } = require("@root/src/models");
const { Bitstamp } = require("@src/lib");
const { Ticker: TickerEvent } = require("@src/events");
const cron = require("node-cron");

const cronSchedule = "*/30 * * * * *"; // Runs every 30 seconds

cron.schedule(cronSchedule, async () => {
    try {
        const currency_pair_symbols = await CurrencyPair.find({}, { symbol: 1, _id: 0 });

        await Promise.all(currency_pair_symbols.map(async (symbol) => {
            if (symbol.symbol === 'HKDUSD') {
                return; // skip processing the FIAT Currency Pair
            } else {
                const data = await Bitstamp.getCurrencyPairMarketTrades(symbol.symbol.toLowerCase());
                if (!data) {
                    // console.log('No data found');
                } else {
                    await MarketTrades.deleteMany({ symbol: symbol.symbol.toLowerCase() }); // Delete previous records
                    await MarketTrades.updateOne(
                        { symbol: symbol.symbol.toLowerCase() },
                        { $push: { trades: { $each: data } } },
                        { upsert: true }
                    );
                }
            }
        }));
    } catch (error) {
        console.log("Error updating market trades:", error);
    }
});