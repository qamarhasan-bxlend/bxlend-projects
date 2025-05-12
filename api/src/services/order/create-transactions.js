"use strict";

const { TRANSACTION_KIND, TRANSACTION_STATUS } = require("@src/constants");

// ------------------------- Service -------------------------

/**
 *
 * @param {{
 *   transactions: Object[]=,
 *   marketOrder: import("mongoose").Schema,
 *   order: import("mongoose").Schema,
 *   sourceCurrencyCode: string,
 *   targetCurrencyCode: string,
 *   sourceQuantity: import("bignumber.js").BigNumber,
 *   quantity: import("bignumber.js").BigNumber,
 *   price: import("bignumber.js").BigNumber,
 * }} input
 * @returns {Object[]}
 */
function createTransactions(input) {
  const { transactions = [], marketOrder, order, sourceCurrencyCode, targetCurrencyCode } = input;
  let { price, sourceQuantity, quantity } = input;

  price = price.toFixed();
  sourceQuantity = sourceQuantity.toFixed();
  quantity = quantity.toFixed();

  const pair_symbol = marketOrder.pair_symbol;

  transactions.push(
    {
      kind: TRANSACTION_KIND.TRANSFER,
      pair_symbol,
      orders: [marketOrder._id, order._id],
      currency_code: sourceCurrencyCode,
      from: marketOrder.wallets[0]._id,
      to: order.wallets[1]._id,
      quantity: sourceQuantity,
      price,
      status: TRANSACTION_STATUS.SUCCESS,
    },
    {
      kind: TRANSACTION_KIND.TRANSFER,
      pair_symbol,
      orders: [order._id, marketOrder._id],
      currency_code: targetCurrencyCode,
      from: order.wallets[0]._id,
      to: marketOrder.wallets[1]._id,
      quantity,
      price,
      status: TRANSACTION_STATUS.SUCCESS,
    },
  );

  return transactions;
}

// ------------------------- Exports -------------------------

module.exports = createTransactions;
