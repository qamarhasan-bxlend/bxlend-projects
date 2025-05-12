"use strict";

/* istanbul ignore file */

const client = require("../client");
const responseHandler = require("../responseHandler");
const { CRYPTOAPIS_WEBHOOK_URL } = require("@src/config");

const webhookURL = CRYPTOAPIS_WEBHOOK_URL; // TODO: it should be the pulicly available url of backend.

function create(blockchain, network, address) {
  return responseHandler(
    client.post(`/blockchain-events/${blockchain}/${network}/subscriptions/address-tokens-transactions-confirmed`,
      {
        "data": {
          "item": {
            "address":address,
            "callbackUrl": `${webhookURL}/v1/webhook/confirmed-transactions/token`
          }
        }
      }
    ),
  );
}

module.exports = {
  create,
};
