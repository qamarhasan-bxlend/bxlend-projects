"use strict";

const { MODEL, OWNER, ORDER_DIRECTION, ORDER_STATUS } = require("@src/constants");
const { BigNumber } = require("@src/lib");
const { StopLimitOrder } = require("@src/models");
const { Types } = require("mongoose");

/**
 * Create a new stop limit order for unit tests.
 *
 * @param {Object} owner
 * @param {Object} pair
 * @param {[Object, Object]} wallets
 * @param {Object=} order
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function stopLimitOrderFactory(owner, pair, wallets, order = {}) {
  const owner_model = owner.constructor.modelName;

  const owner_type = owner_model === MODEL.USER ? OWNER.USER : OWNER.CLIENT;

  return StopLimitOrder.create({
    direction: ORDER_DIRECTION.BUY,
    quantity: wallets[0].balance,
    status: ORDER_STATUS.ACTIVE,
    remainder: wallets[0].balance,
    limit_price: new BigNumber(wallets[1].balance).div(wallets[0].balance).toFixed(),
    stop_price: new BigNumber(wallets[1].balance).div(wallets[0].balance).toFixed(),
    fee: {
      percentage: 0,
      amount: Types.Decimal128.fromString("0"),
    },
    ...order,
    owner_type,
    owner: owner._id,
    pair_symbol: pair.symbol,
    wallets: [wallets[0]._id, wallets[1]._id],
  });
};
