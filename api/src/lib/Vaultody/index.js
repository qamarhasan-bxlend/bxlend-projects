"use strict";

/* istanbul ignore file */

const {
  address,
  token_transaction,
  account_based_coin_transaction,
  utxo_based_coin_transaction,
  single_coin_feeless_transaction,
  single_token_feeless_transaction
} = require("./wallets");
const {
  fee
} = require('./BlockchainData')


module.exports = {
  createWalletAddress: address.create,
  createFungibleTokenTransactionRequest: token_transaction.create,
  createAccountBasedCoinTransaction : account_based_coin_transaction.create,
  createUTXOBasedCoinTransaction : utxo_based_coin_transaction.create,
  createSingleCoinFeelessTransaction : single_coin_feeless_transaction.create,
  createSingleTokenFeelessTransaction : single_token_feeless_transaction.create
  
};
