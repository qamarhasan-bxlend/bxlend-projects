"use strict";

const client = require("../client");
const responseHandler = require("../responseHandler");
const { VAULTODY_GENERAL_VAULT_ID } = require("@src/config");
const { getVaultodyHeaders } = require('../helper');

function create(blockchain, network, senderAddress, amount, recipientAddress, tokenIdentifier) {
  const path = `/vaults/${VAULTODY_GENERAL_VAULT_ID}/${blockchain}/${network}/addresses/${senderAddress}/feeless-token-transaction-requests`;

  const body = {
    data: {
      item: {
        amount: amount,
        note: "",// TODO
        recipientAddress: recipientAddress,
        tokenIdentifier: tokenIdentifier
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
