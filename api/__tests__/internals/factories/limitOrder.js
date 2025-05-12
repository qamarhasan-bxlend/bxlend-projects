"use strict";

const { MODEL, OWNER, ORDER_DIRECTION, ORDER_STATUS } = require("@src/constants");
const { BigNumber } = require("@src/lib");
const { LimitOrder } = require("@src/models");
const { Types } = require("mongoose");

/**
 * Create a new limit order for unit tests.
 *
 * @param {Object} owner
 * @param {Object} pair
 * @param {[Object, Object]} wallets
 * @param {Object=} order
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function limitOrderFactory(owner, pair, wallets, order = {}) {
  const owner_model = owner.constructor.modelName;

  const owner_type = owner_model === MODEL.USER ? OWNER.USER : OWNER.CLIENT;

  const quantity = order.quantity ?? wallets[0].balance;
  const remainder = order.remainder ?? quantity;

  return LimitOrder.create({
    direction: ORDER_DIRECTION.SELL,
    status: ORDER_STATUS.ACTIVE,
    limit_price: new BigNumber(wallets[0].balance).div(wallets[1].balance).toFixed(),
    fee: {
      percentage: 0,
      amount: Types.Decimal128.fromString("0"),
      remainder: Types.Decimal128.fromString("0"),
    },
    ...order,
    owner_type,
    owner: owner._id,
    pair_symbol: pair.symbol,
    wallets: wallets.map(wallet => wallet._id),
    quantity,
    remainder,
  });
};
