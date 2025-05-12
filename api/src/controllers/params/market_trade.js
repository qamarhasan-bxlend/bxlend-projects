"use strict";

const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");
const { CurrencyPair } = require("@src/models");

async function pairSymbolParamController(req, res, next) {
  let symbol = req.params.market_trade_symbol;

  const currencyPair = await CurrencyPair.findOne({
    symbol: symbol.toUpperCase(),
    deleted_at: { $exists: false },
  });

  if (currencyPair == null) throw new NotFound(ERROR.MARKET_TRADE_NOT_FOUND);

  next();
}

module.exports = pairSymbolParamController;
