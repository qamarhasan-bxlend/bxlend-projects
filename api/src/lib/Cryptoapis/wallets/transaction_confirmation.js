"use strict";

/* istanbul ignore file */

const client = require("../client");
const responseHandler = require("../responseHandler");

function get(blockchain,network,transactionId) {
  return responseHandler(
    client.get(
      `/wallet-as-a-service/wallets/${blockchain}/${network}/transactions/${transactionId}`
    )
  );
}

module.exports = {
  get,
};
