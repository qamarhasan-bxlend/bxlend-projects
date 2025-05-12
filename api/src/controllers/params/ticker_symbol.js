"use strict";

const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");
const { Ticker } = require("@src/models");

async function pairSymbolParamController(req, res, next) {
  let ticker_symbol = req.params.ticker_symbol;
  // console.log(ticker_symbol);

  ticker_symbol = ticker_symbol.replace("-", "/");
  const ticker = await Ticker.findOne({
    pair_symbol: ticker_symbol,
    deleted_at: { $exists: false },
  });

  if (ticker == null) throw new NotFound(ERROR.TICKER_NOT_FOUND);

  req.params.ticker_symbol = ticker;

  next();
}

module.exports = pairSymbolParamController;
