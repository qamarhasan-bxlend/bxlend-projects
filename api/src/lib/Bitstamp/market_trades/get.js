"use strict";

const client = require("../client");
async function get(currencyPair) {

  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await client.get(`/api/v2/transactions/${currencyPair}/`, headers);
    return response.data;
  } catch (error) {
    // console.error(error);
    // throw new Error("An error occurred while fetching market-trade data");
  }
}

module.exports = {
  get,
};
