
"use strict";

const Axios = require("axios");
const { COIN_CONVERT_HTTP_API_URL } = require("@src/config");

const axios = Axios.create({
  baseURL: COIN_CONVERT_HTTP_API_URL,
  timeout: 4000,
  headers : {
    "Content-Type": "application/json",
  }
});

module.exports = axios