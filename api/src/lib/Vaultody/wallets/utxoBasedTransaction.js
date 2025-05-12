"use strict";

const client = require("../client");
const responseHandler = require("../responseHandler");
const { CRYPTOAPIS_TRANSACTION_WALLET_FEE_PRIORITY } = require('@src/constants');
const { VAULTODY_GENERAL_VAULT_ID } = require("@src/config");
const { getVaultodyHeaders } = require('../helper');

function create(blockchain, network, address, amount, recipientAddress) {
  const path = `/vaults/${VAULTODY_GENERAL_VAULT_ID}/${blockchain}/${network}/transaction-requests`;
  
  const body = {
    data: {
      item: {
        feePriority: CRYPTOAPIS_TRANSACTION_WALLET_FEE_PRIORITY.SLOW,
        note: "",// TODO
        prepareStrategy: "optimize-size",
        recipients: [
                {
                    "address": recipientAddress,
                    "amount": amount
                }
        ]
      },
    },
  };

  const headers = {
    ...client.defaults.headers.common,
    ...getVaultodyHeaders('POST', path, body, JSON.stringify({}))
  };

  return responseHandler(
    client.post(
      path,
      body,
      { headers }
    )
  );
}

module.exports = {
  create,
};
