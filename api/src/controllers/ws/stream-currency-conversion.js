"use strict";

const { CurrencyConversion } = require("@src/events");
const { wrapAsyncFn } = require("@src/utils");

module.exports = async function streamCurrencyConversionWSController(req, res) {

  const listener = wrapAsyncFn(async (data) => {
    res.send(data)
  });

  CurrencyConversion.on("",listener);

  req.once("closed", () => CurrencyConversion.off("",listener));
};
