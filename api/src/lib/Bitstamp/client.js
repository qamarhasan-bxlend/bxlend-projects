"use strict";

const Axios = require("axios");
const { BITSTAMP_HTTP_API_URL } = require("@src/config");

const axios = Axios.create({
  baseURL: BITSTAMP_HTTP_API_URL,
  timeout: 4000,
});

module.exports = axios