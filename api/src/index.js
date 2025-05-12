"use strict";

require("module-alias/register");
require("./database");

const { API_PORT, WEB_SOCKET_SERVER_PORT } = require("@src/config");
const { trade, ticker } = require("@src/queue");
const mongoose = require("mongoose");
const util = require("util");
const express = require("./server");
const {webSocketServer} = require("./websocket-server");
require('@root/src/services/ticker/update')
require('@root/src/services/currency-exchange/update')
require('@root/src/services/market-trade/update')
require('@root/src/services/Fee-Recommendations/update')
require('@root/src/services/presaleUser/presaleBonus')

// ------------------------- HTTP Server ---------------------------------

const server = express.listen(API_PORT, () => console.log(`HTTP Server Listening at :${ API_PORT }`));

// ------------------------- Web Socket Server ---------------------------

webSocketServer.listen(() => console.log(`WS Server Listening at :${ WEB_SOCKET_SERVER_PORT }`));

// ------------------------- Graceful Shutdown --------------------------

async function shutdown() {
  try {
    const closeHTTPServer = util.promisify(server.close.bind(server));
    const closeWSServer = util.promisify(webSocketServer.server.close.bind(webSocketServer.server));
    const trade_queues = Object.values(trade);
    const ticker_queues = Object.values(ticker);

    // First: stop receiving new requests!
    await Promise.all([
      closeHTTPServer(),
      closeWSServer(),
    ]);

    // Second: stop processing new queue jobs!
    await Promise.all(trade_queues.map(queue => queue.close()));
    await Promise.all(ticker_queues.map(queue => queue.close()));

    // Last: close the DB connection, now that there is no ongoing operations!
    await mongoose.connection.close(false);

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
