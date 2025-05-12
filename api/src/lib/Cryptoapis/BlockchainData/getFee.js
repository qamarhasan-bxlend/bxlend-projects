"use strict";

/* istanbul ignore file */

const client = require("../client");
const responseHandler = require("../responseHandler");
function get(blockchain, network) {
    return responseHandler(
      client.get(`/blockchain-data/${blockchain}/${network}/mempool/fees`),
    );
  }
module.exports = {
  get,
};
