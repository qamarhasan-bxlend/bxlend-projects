"use strict";

const { trade } = require("@src/queue");
const { listKlines } = require("@src/services");
const { wrapAsyncFn, normalizeInterval } = require("@src/utils");
const BigNumber = require("bignumber.js");
const moment = require("moment");

module.exports = async function streamTickerWSController(req, res) {
  const { symbol, interval } = req.query;

  const normalizedInterval = normalizeInterval(interval);

  let [last = null] = await listKlines({
    pair_symbol: symbol,
    interval: normalizedInterval,
    limit: 1,
  });

  const listener = wrapAsyncFn(async (job, result) => {
    const { ticker } = result;

    if (last != null && moment(last.timestamp).add(normalizedInterval, "s").isBefore(ticker.time)) {
      const klines = await listKlines({
        pair_symbol: symbol,
        interval: normalizedInterval,
        limit: 1,
      });

      last = klines[0];
    }

    last = {
      timestamp: last?.timestamp ?? ticker.time,
      open: last?.open ?? ticker.from,
      close: ticker.close,
      high: BigNumber.max(last?.high ?? 0, ticker.high),
      low: BigNumber.min(last?.high ?? Infinity, ticker.low),
    };

    res.send([
      last.timestamp,
      last.open,
      last.close,
      last.high,
      last.low,
    ]);
  });

  trade[symbol].on("completed", listener);

  req.once("closed", () => trade[symbol].off("completed", listener));
};
