"use strict";

const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");
const { CurrencyPair } = require("@src/models");
const { Types } = require("mongoose");

async function currencyPairParamController(req, res, next) {
  const id = req.params.currency_pair;

  if (!Types.ObjectId.isValid(id)) throw new NotFound(ERROR.CURRENCY_PAIR_NOT_FOUND);

  const currencyPair = await CurrencyPair.findOne({
    _id: Types.ObjectId(id),
    deleted_at: { $exists: false },
  });

  if (currencyPair == null) throw new NotFound(ERROR.CURRENCY_PAIR_NOT_FOUND);

  req.params.currency_pair = currencyPair;

  next();
}

module.exports = currencyPairParamController;
