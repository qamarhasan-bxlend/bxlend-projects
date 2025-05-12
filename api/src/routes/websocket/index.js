"use strict";

const { ws } = require("@src/controllers");
const { WebSocket: { Router } } = require("@src/lib");

const router = new Router();

// TODO: versioning.

router
  .on("/book", ws.streamOrderBook)
  .on("/trade", ws.streamTrade)
  .on("/ticker", ws.streamTicker)
  .on("/kline", ws.streamKLine)
  .on("/currency", ws.streamCurrencyConversion)
  .on("/order", ws.streamOrder);

module.exports = router;
