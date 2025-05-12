"use strict";

/* istanbul ignore file */

const client = require("../client");
const responseHandler = require("../responseHandler");

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

function create(blockchain, network, walletId, label = "No label") {
  return responseHandler(
    client.post(`/wallet-as-a-service/wallets/${walletId}/${blockchain}/${network}/addresses`,
      {
        "data": {
          "item": {
            label
          }
        }
      }
    ),
  );
}

module.exports = {
  getAll,
  get,
  update,
  create,
};
