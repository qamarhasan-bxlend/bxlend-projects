"use strict";

const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");
const { Currency } = require("@src/models");

async function currencyCodeParamController(req, res, next) {
  const code = req.params.currency_code;

  const currency = await Currency.findOne({
    code: code,
    deleted_at: { $exists: false },
  }).populate({
    path: 'supported_blockchains.blockchain',  // Populate the blockchain reference within supported_blockchains array
    select: 'name symbol description native_currency website networks token_standards',  // Select specific fields from the Blockchain model (you can customize this)
  });

  if (currency == null) throw new NotFound(ERROR.CURRENCY_NOT_FOUND);

  req.params.currency_code = currency;

  next();
}

module.exports = currencyCodeParamController;
