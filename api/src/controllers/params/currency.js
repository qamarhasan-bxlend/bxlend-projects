"use strict";

const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");
const { Currency } = require("@src/models");
const { Types } = require("mongoose");

async function currencyParamController(req, res, next) {
  const id = req.params.currency;

  if (!Types.ObjectId.isValid(id)) throw new NotFound(ERROR.CURRENCY_NOT_FOUND);

  const currency = await Currency.findOne({
    _id: Types.ObjectId(id),
    deleted_at: { $exists: false },
  });

  if (currency == null) throw new NotFound(ERROR.CURRENCY_NOT_FOUND);

  req.params.currency = currency;

  next();
}

module.exports = currencyParamController;
