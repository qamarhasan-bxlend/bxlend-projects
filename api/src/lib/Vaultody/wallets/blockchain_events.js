"use strict";

/* istanbul ignore file */

const client = require("../client");
const responseHandler = require("../responseHandler");
const { CRYPTOAPIS_WEBHOOK_URL } = require("@src/config");

function get(blockchain, network) {
  return responseHandler(
    client.get(`/blockchain-events/${blockchain}/${network}/subscriptions`),
  );
}
function deleteEventSubscription(blockchain, network, referenceID) {
  return responseHandler(
    client.delete(`/blockchain-events/${blockchain}/${network}/subscriptions/${referenceID}`)
  )
}

module.exports = {
  get,
  delete: deleteEventSubscription,
};
