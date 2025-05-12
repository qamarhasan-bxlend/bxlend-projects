"use strict";

/* istanbul ignore file */

const client = require("../client");
const responseHandler = require("../responseHandler");
const {CRYPTOAPIS_TRANSACTION_WALLET_FEE_PRIORITY} = require('@src/constants')


function get(crypto_api_transaction_request_id) {
  return responseHandler(
    client.get(
      `/wallet-as-a-service/transactionRequests/${crypto_api_transaction_request_id}`
    )
  );
}

module.exports = {
  get,
};
