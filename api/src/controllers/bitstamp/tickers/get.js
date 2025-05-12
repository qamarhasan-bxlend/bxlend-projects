"use strict";

const bodyParser = require("body-parser");
const { Ticker, CurrencyPair } = require("@root/src/models");

const CONTROLLER = [
  bodyParser.json(),
  async function getCurrencyPairsTickers(req, res) {
    const currencypairs = await CurrencyPair.find();
    const pairSymbols = currencypairs.map(
      (pair) => `${pair.currency_codes[0]}/${pair.currency_codes[1]}`
    );

    const tickerDocuments = await Ticker.find({
      pair_symbol: {
        $in: pairSymbols,
      },
    });

    if (!tickerDocuments) throw new Error("Could not fetch tickers.");

    const transformedData = tickerDocuments.map((doc) => ({
      pair: doc.pair_symbol,
      open: doc.from,
      last: doc.to,
      high: doc.high,
      low: doc.low,
      percent_change_24: doc.percentage_change,
      volume: doc.volume,
    }));
    res.json(transformedData);
  },
];

module.exports = CONTROLLER;
