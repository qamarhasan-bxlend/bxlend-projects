"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should fulfill both market & limit orders (Market BUY)", async () => {
  const { factory } = require("@tests/internals");
  const { ORDER_STATUS } = require("@src/constants");
  const { BigNumber } = require("@src/lib");
  const {
    Transaction,
    TransferTransaction,
    LimitOrder,
    MarketOrder,
    CryptoWallet,
    CurrencyPair,
  } = require("@src/models");
  const { executeOrder } = require("@src/services");

  const [buyer, seller, coin1, coin2] = await Promise.all([
    factory.user(),
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);

  const buyerCoin1Quantity = "2.364";
  const buyerCoin2Quantity = "27.726";
  const limitPrice = new BigNumber(buyerCoin2Quantity).div(buyerCoin1Quantity);
  const limit_price = limitPrice.toFixed();
  const sellerCoin1Quantity = "234.47684";
  const sellerCoin2Quantity = limitPrice.times(buyerCoin1Quantity).toFixed();

  const [buyerCoin1Wallet, buyerCoin2Wallet, sellerCoin1Wallet, sellerCoin2Wallet, pair] = await Promise.all([
    factory.cryptoWallet(buyer, coin1, { balance: buyerCoin1Quantity }),
    factory.cryptoWallet(buyer, coin2, { balance: buyerCoin2Quantity }),
    factory.cryptoWallet(seller, coin1, { balance: sellerCoin1Quantity }),
    factory.cryptoWallet(seller, coin2, { balance: sellerCoin2Quantity }),
    factory.currencyPair([coin1, coin2]),
    factory.internalWallet(coin1),
    factory.internalWallet(coin2),
  ]);
  const [limitOrder, marketOrder] = await Promise.all([
    factory.limitOrder(seller, pair, [sellerCoin2Wallet, sellerCoin1Wallet], { limit_price }),
    factory.marketOrder(buyer, pair, [buyerCoin1Wallet, buyerCoin2Wallet]),
  ]);

  await executeOrder(marketOrder);

  expect(await Transaction.countDocuments()).toBe(2);
  expect(await TransferTransaction.countDocuments()).toBe(2);

  const updatedLimitOrder = await LimitOrder.findById(limitOrder._id);

  expect(+updatedLimitOrder.remainder).toBe(0);
  expect(updatedLimitOrder.status).toEqual(ORDER_STATUS.FULFILLED);

  const updatedMarketOrder = await MarketOrder.findById(marketOrder._id);

  expect(updatedMarketOrder.status).toEqual(ORDER_STATUS.FULFILLED);

  const updatedBuyerCoin1Wallet = await CryptoWallet.findById(buyerCoin1Wallet._id);

  expect(+updatedBuyerCoin1Wallet.balance).toBe(0);

  const updatedBuyerCoin2Wallet = await CryptoWallet.findById(buyerCoin2Wallet._id);

  expect(updatedBuyerCoin2Wallet.balance).toEqual(new BigNumber(buyerCoin2Quantity).plus(sellerCoin2Quantity).toFixed());

  const updatedSellerCoin1Wallet = await CryptoWallet.findById(sellerCoin1Wallet._id);

  expect(updatedSellerCoin1Wallet.balance).toEqual(new BigNumber(sellerCoin1Quantity).plus(buyerCoin1Quantity).toFixed());

  const updatedSellerCoin2Wallet = await CryptoWallet.findById(sellerCoin2Wallet._id);

  expect(+updatedSellerCoin2Wallet.balance).toBe(0);

  const updatedPair = await CurrencyPair.findById(pair._id);

  expect(updatedPair.price).toEqual(limit_price);
});

it("should fulfill both market & limit orders (Market SELL)", async () => {
  const { factory } = require("@tests/internals");
  const { ORDER_STATUS, ORDER_DIRECTION } = require("@src/constants");
  const { BigNumber } = require("@src/lib");
  const {
    Transaction,
    TransferTransaction,
    LimitOrder,
    MarketOrder,
    CryptoWallet,
    CurrencyPair,
  } = require("@src/models");
  const { executeOrder } = require("@src/services");

  const [buyer, seller, coin1, coin2] = await Promise.all([
    factory.user(),
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);

  const buyerCoin1Quantity = "2.364";
  const buyerCoin2Quantity = "27.726";
  const limitPrice = new BigNumber(buyerCoin2Quantity).div(buyerCoin1Quantity);
  const limit_price = limitPrice.toFixed();
  const sellerCoin1Quantity = "234.47684";
  const sellerCoin2Quantity = limitPrice.times(buyerCoin1Quantity).toFixed();

  const [buyerCoin1Wallet, buyerCoin2Wallet, sellerCoin1Wallet, sellerCoin2Wallet, pair] = await Promise.all([
    factory.cryptoWallet(buyer, coin1, { balance: buyerCoin1Quantity }),
    factory.cryptoWallet(buyer, coin2, { balance: buyerCoin2Quantity }),
    factory.cryptoWallet(seller, coin1, { balance: sellerCoin1Quantity }),
    factory.cryptoWallet(seller, coin2, { balance: sellerCoin2Quantity }),
    factory.currencyPair([coin1, coin2], { price: limit_price }),
    factory.internalWallet(coin1),
    factory.internalWallet(coin2),
  ]);
  const [limitOrder, marketOrder] = await Promise.all([
    factory.limitOrder(buyer, pair, [buyerCoin1Wallet, buyerCoin2Wallet], {
      limit_price,
      direction: ORDER_DIRECTION.BUY,
    }),
    factory.marketOrder(seller, pair, [sellerCoin2Wallet, sellerCoin1Wallet], { direction: ORDER_DIRECTION.SELL }),
  ]);

  await executeOrder(marketOrder);

  expect(await Transaction.countDocuments()).toBe(2);
  expect(await TransferTransaction.countDocuments()).toBe(2);

  const updatedLimitOrder = await LimitOrder.findById(limitOrder._id);

  expect(+updatedLimitOrder.remainder).toBe(0);
  expect(updatedLimitOrder.status).toEqual(ORDER_STATUS.FULFILLED);

  const updatedMarketOrder = await MarketOrder.findById(marketOrder._id);

  expect(updatedMarketOrder.status).toEqual(ORDER_STATUS.FULFILLED);

  const updatedBuyerCoin1Wallet = await CryptoWallet.findById(buyerCoin1Wallet._id);

  expect(+updatedBuyerCoin1Wallet.balance).toBe(0);

  const updatedBuyerCoin2Wallet = await CryptoWallet.findById(buyerCoin2Wallet._id);

  expect(updatedBuyerCoin2Wallet.balance).toEqual(new BigNumber(buyerCoin2Quantity).plus(sellerCoin2Quantity).toFixed());

  const updatedSellerCoin1Wallet = await CryptoWallet.findById(sellerCoin1Wallet._id);

  expect(updatedSellerCoin1Wallet.balance).toEqual(new BigNumber(sellerCoin1Quantity).plus(buyerCoin1Quantity).toFixed());

  const updatedSellerCoin2Wallet = await CryptoWallet.findById(sellerCoin2Wallet._id);

  expect(+updatedSellerCoin2Wallet.balance).toBe(0);

  const updatedPair = await CurrencyPair.findById(pair._id);

  expect(updatedPair.price).toEqual(limit_price);
});
