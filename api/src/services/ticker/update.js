"use strict";

const { Ticker } = require("@root/src/models");
const { Bitstamp } = require("@src/lib");
const { Ticker:TickerEvent } = require("@src/events");
const cron = require("node-cron");

const cronSchedule = "*/2 * * * * *"; // Runs every 2 seconds

cron.schedule(cronSchedule, async () => {
  try {
    const tickerData = await Bitstamp.getAllCurrencyPairsTicker();

    if (!tickerData) {
      throw new Error("An error occurred while fetching ticker data");
    }
    await updateTickerData(tickerData);

    // console.log("Ticker updated successfully.");
  } catch (error) {
    // console.error(error)
    // console.log("Error updating Ticker.");
  }
});

async function updateTickerData(tickerData) {
  const updateOperations = tickerData.map((ticker) => {
    const filter = { pair_symbol: ticker.pair };
    const update = {
      $set: {
        from: ticker.open,
        to: ticker.last,
        high: ticker.high,
        low: ticker.low,
        percentage_change: ticker.percent_change_24,
        volume: ticker.volume,
      },
    };
    return {
      updateOne: {
        filter,
        update,
        upsert: true, // Create a new document if it doesn't exist
      },
    };
  });
  try {
    await Ticker.bulkWrite(updateOperations);
    TickerEvent.emit("",tickerData)
  } catch (error) {
    console.error("Error updating documents:", error);
  }
}
