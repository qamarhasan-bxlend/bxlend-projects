"use strict";

const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");
const { Blockchain } = require("@src/models");
const { Types } = require("mongoose");

async function blockchainParamController(req, res, next) {
  const id = req.params.blockchain;

  if (!Types.ObjectId.isValid(id)) throw new NotFound(ERROR.CURRENCY_PAIR_NOT_FOUND);

  const blockchain = await Blockchain.findOne({
    _id: Types.ObjectId(id),
    deleted_at: { $exists: false },
  });

  if (blockchain == null) throw new NotFound(ERROR.BLOCKCHAIN_NOT_FOUND);

  req.params.blockchain = blockchain;

  next();
}

module.exports = blockchainParamController;
