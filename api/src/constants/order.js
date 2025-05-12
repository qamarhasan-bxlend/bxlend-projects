"use strict";

const ORDER_KIND = {
  MARKET: "MARKET",
  LIMIT: "LIMIT",
  STOP_LIMIT: "STOP_LIMIT",
};

const ORDER_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  FULFILLED: "FULFILLED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
};

const SCRYPT_ORDER_STATUS = {
  //TODO: add all scrypt statuses
  PendingNew: "ACTIVE",
  New: "ACTIVE",
  Filled: "FULFILLED",
  Rejected: "FAILED",
  Canceled: "CANCELLED",
};

const ORDER_DIRECTION = {
  BUY: "BUY",
  SELL: "SELL",
};

const ORDER_TYPE = {
  OPEN_ORDER : "OPEN_ORDER",
  ORDER_HISTORY : "ORDER_HISTORY",
  TRADE_HISTORY : "TRADE_HISTORY",
}

const ORDER_REASON = {
  INSUFFICIENT_MAKER_LIQUIDITY: "insufficient-maker-liquidity",
};

module.exports = {
  ORDER_KIND,
  ORDER_STATUS,
  ORDER_DIRECTION,
  ORDER_REASON,
  SCRYPT_ORDER_STATUS,
  ORDER_TYPE,
};
