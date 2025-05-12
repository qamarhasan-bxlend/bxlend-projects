"use strict";

const client = require("../client");
async function getAll() {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await client.get(`/api/v2/ticker/`, headers);
    return response.data;
  } catch (error) {
    // console.error(error);
    throw new Error("An error occurred while fetching ticker data");
  }
}

module.exports = {
  getAll,
};
