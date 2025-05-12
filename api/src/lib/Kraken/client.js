"use strict";

const Axios = require("axios");
const { KRAKEN_HTTP_API_URL } = require("@src/config");

const axios = Axios.create({
  baseURL: KRAKEN_HTTP_API_URL,
  timeout: 4000,
});

module.exports = axios;
