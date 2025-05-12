"use strict";

/* istanbul ignore file */

const Axios = require("axios");
const { CRYPTOAPIS_API_KEY, CRYPTOAPIS_API_URI } = require("@src/config");

const axios = Axios.create({
  baseURL: CRYPTOAPIS_API_URI,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": `${CRYPTOAPIS_API_KEY}`,
  },
});

module.exports = axios;
