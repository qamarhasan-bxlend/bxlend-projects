"use strict";

/* istanbul ignore file */

const client = require("../client");
const responseHandler = require("../responseHandler");

function getAll(coin, walletId) {
  return responseHandler(client.get(`/${coin}/wallet/${walletId}/addresses`));
}

function get(coin, walletId, addressOrId) {
  return responseHandler(client.get(`/${coin}/wallet/${walletId}/address/${addressOrId}`));
}

function update(coin, walletId, addressOrId, { label } = {}) {
  return responseHandler(client.put(`/${coin}/wallet/${walletId}/address/${addressOrId}`, { label }));
}

function create(coin, walletId, { chain, label, lowPriority, gasPrice, forwarderVersion, onToken } = {}) {

  return responseHandler(
    client.post(`/${coin}/wallet/${walletId}/address`, {
      chain,
      label,
      lowPriority,
      gasPrice,
      forwarderVersion,
      onToken,
    }),
  );
}

module.exports = {
  getAll,
  get,
  update,
  create,
};
