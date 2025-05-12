"use strict";

const { CurrencyPair, Ticker } = require("@root/src/models");
const { CoinConvert } = require("@src/lib");
const { Ticker: TickerEvent } = require("@src/events");
const cron = require("node-cron");
const { BigNumber } = require("@src/lib");

const cronSchedule = "* * * * *"; // Runs every 5 minutes

cron.schedule(cronSchedule, async () => {
  try {
    const exchangeRate = await CoinConvert.getHkdUsdExchange();
    // console.log('exchange rate ',exchangeRate)

    if (!exchangeRate) {
      return 
      throw new Error("An error occurred while fetching  ExchangeRate");
    }
    await updateExchangeRate(exchangeRate);

    // console.log("HKD to USD Exchange Rate updated successfully.");
  } catch (error) {
    console.error(error);
    console.log("Error Exchange Rate.");
  }
});

async function updateExchangeRate(exchangeRate) {
  try {
    let pairs = [],
      price = [];

    for (const key in exchangeRate) {
      if (Object.hasOwnProperty.call(exchangeRate, key)) {
        pairs.push(key);
        price.push(exchangeRate[key]);
      }
    }
    // console.log('exhangeRate',exchangeRate)

    let pair_symbol = pairs[1].toString() + pairs[2].toString();
    const new_price = new BigNumber(price[2]);

    await CurrencyPair.updateOne(
      { symbol: pair_symbol },
      { $set: { price: new_price } },
      { new: true }
    );
    pair_symbol = `${pairs[1].toString()}/${pairs[2].toString()}`;
    // console.log('lobc',pair_symbol)
    const updatedTicker = await Ticker.updateOne(
      { pair_symbol: pair_symbol },
      {
        $set: {
          from: new_price,
          last: new_price,
          high: new_price,
          low: new_price,
          to: new_price,
        },
      },
      { new: true }
    );
    // console.log("the updated ticker is ",updatedTicker)
  } catch (error) {
    // console.error("Error updating documents:", error);
    console.log("Could not find currency pair to update Exchange Rate");
  }
}
