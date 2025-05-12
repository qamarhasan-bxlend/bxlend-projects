"use strict";

const client = require("./client");
async function getHkdUsdExchange() {
  try {
    
    const response = await client.get(`/convert/hkd/usd?amount=1/`);
    return response.data;
  } catch (error) {
    // console.error(error);
    // throw new Error("An error occurred while fetching Currency-Exchange Value");
  }
}

module.exports = {
  getHkdUsdExchange
}