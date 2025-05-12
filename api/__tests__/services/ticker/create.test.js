"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should create ticker", async () => {
  const { serializeDocument } = require("@tests/internals");
  const { Ticker } = require("@src/models");
  const { createTicker } = require("@src/services");

  const input = {
    pair_symbol: "USDTBTC",
    from: "12000",
    to: "25000",
  };

  const ticker = await createTicker(input);

  expect(await Ticker.countDocuments()).toBe(1);

  expect(ticker.time).toBeDefined();
  expect(ticker.created_at).toBeDefined();
  expect(ticker.updated_at).toBeDefined();

  expect(serializeDocument(ticker, ["pair", "from", "to", "high", "low"])).toEqual({
    pair: input.pair_symbol,
    from: input.from,
    to: input.to,
    high: input.to,
    low: input.from,
  });
});
