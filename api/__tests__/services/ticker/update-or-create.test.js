"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should create ticker if no match exists", async () => {
  const { serializeDocument } = require("@tests/internals");
  const { Ticker } = require("@src/models");
  const { updateOrCreateTicker } = require("@src/services");

  const input = {
    pair_symbol: "USDTBTC",
    initialPrice: "12000",
    finalPrice: "25000",
  };

  expect(await Ticker.countDocuments()).toBe(0);

  const ticker = await updateOrCreateTicker(input);

  expect(await Ticker.countDocuments()).toBe(1);

  expect(ticker.time).toBeDefined();
  expect(ticker.created_at).toBeDefined();
  expect(ticker.updated_at).toBeDefined();

  expect(serializeDocument(ticker, ["pair", "from", "to", "high", "low"])).toEqual({
    pair: input.pair_symbol,
    from: input.initialPrice,
    to: input.finalPrice,
    high: input.finalPrice,
    low: input.initialPrice,
  });
});

it("should update ticker if match exists", async () => {
  const { serializeDocument, factory } = require("@tests/internals");
  const { Ticker } = require("@src/models");
  const { updateOrCreateTicker } = require("@src/services");

  const ticker = await factory.ticker({
    from: "15000",
    to: "30000",
  });

  const input = {
    pair_symbol: ticker.pair_symbol,
    time: ticker.time,
    initialPrice: "12000",
    finalPrice: "25000",
  };

  const resultTicker = await updateOrCreateTicker(input);

  expect(await Ticker.countDocuments()).toBe(1);

  const updatedTicker = await Ticker.findOne();

  const serializedTicker = serializeDocument(ticker);
  const serializedResultTicker = serializeDocument(resultTicker);

  expect(serializeDocument(updatedTicker)).toEqual({
    pair: input.pair_symbol,
    from: serializedTicker.from,
    to: input.finalPrice,
    high: serializedTicker.to,
    low: input.initialPrice,
    time: serializedTicker.time,
    created_at: serializedTicker.created_at,
    updated_at: serializedResultTicker.updated_at,
  });
});
