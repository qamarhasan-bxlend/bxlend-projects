"use strict";

/* istanbul ignore file */

const {
  wallet,
  address,
  token_subscription,
  transaction,
  coin_subscription,
  blockchain_events,
  transaction_details,
  transaction_confirmation
} = require("./wallets");
const {
  fee
} = require('./BlockchainData')


module.exports = {
  // getAllWallets: wallet.getAll,
  // getWallet: wallet.get,
  // updateWallet: wallet.update,
  // createWallet: wallet.create,
  // removeWallet: wallet.remove,
  // freezeWallet: wallet.freeze,
  // getWalletByAddress: wallet.getByAddress,
  // getWalletUnspents: wallet.getUnspents,
  // getWalletMaximumSpendable: wallet.getMaximumSpendable,
  // getWalletSpendingLimits: wallet.getSpendingLimits,
  // getWalletAllReservedUnspent: wallet.getAllReservedUnspent,
  // getWalletAllBalances: wallet.getAllBalances,
  // getWalletBalanceReserveData: wallet.getBalanceReserveData,
  // makeWalletReservedUnspents: wallet.makeReservedUnspents,
  // modifyWalletReservedUnspents: wallet.modifyReservedUnspents,
  // removeWalletUserFrom: wallet.removeUserFrom,
  // releaseWalletReservedUnspent: wallet.releaseReservedUnspent,
  // buildWalletTransaction: wallet.buildTransaction,
  // initiateWalletTransaction: wallet.initiateTransaction,
  // sendWalletHalfSignedTransaction: wallet.sendHalfSignedTransaction,
  // initiateWalletTrustlineTransactionWallet: wallet.initiateTrustlineTransaction,

  getAllWalletAddresses:address.getAll,
  // getWalletAddress:address.get,
  // updateWalletAddress:address.update,
  createWalletAddress:address.create,
  createWalletTokenSubscription:token_subscription.create,
  createWalletCoinSubscription : coin_subscription.create,
  createWithdrawTransaction: transaction.create,
  listBlockChainEventSubscriptions : blockchain_events.get,
  DeleteBlockChainEventSubscription : blockchain_events.delete,
  getTransactionDetailByTransactionID : transaction_details.get,
  getTransactionConfirmation : transaction_confirmation.get,
  getFeeRecommendation : fee.get
};
