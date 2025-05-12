"use strict";

const { Ticker } = require("@src/events");
// const { trade } = require("@src/queue");
const { wrapAsyncFn } = require("@src/utils");

module.exports = async function streamTickerWSController(req, res) {

  const listener = wrapAsyncFn(async (data) => {
    res.send(data);
  });

  Ticker.on("", listener);

  req.once("closed", () => Ticker.off("", listener));
};
