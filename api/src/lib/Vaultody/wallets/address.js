"use strict";

/* istanbul ignore file */

const client = require("../client");
const responseHandler = require("../responseHandler");
const helper = require("../helper");

function getAll(blockchain, network, walletId) {
  // return responseHandler(client.get(`/${coin}/wallet/${walletId}/addresses`));
  return responseHandler(client.get(`/blockchain-data/${blockchain}/${network}/addresses/${walletId}`));
}

function get(coin, walletId, addressOrId) {
  return responseHandler(client.get(`/${coin}/wallet/${walletId}/address/${addressOrId}`));
}

function update(coin, walletId, addressOrId, { label } = {}) {
  return responseHandler(client.put(`/${coin}/wallet/${walletId}/address/${addressOrId}`, { label }));
}

function create(blockchain, network, vaultId, label = "No label") {
  const path = `/vaults/${vaultId}/${blockchain}/${network}/addresses`;
  const body = {
    "data": {
      "item": {
        label
      }
    }
  }
  var headers = {
    ...client.defaults.headers.common,
    ...helper.getVaultodyHeaders("POST", path, body, JSON.stringify({}))
  }
  
  return responseHandler(
    client.post(
      path,
      body,
      {headers}
    ),
  );
}

module.exports = {
  getAll,
  get,
  update,
  create,
};
