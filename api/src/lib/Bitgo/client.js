"use strict";

/* istanbul ignore file */

const Axios = require("axios");
const { BITGO_ACCESS_TOKEN, BITGO_API_URI } = require("@src/config");

const axios = Axios.create({
  baseURL: BITGO_API_URI,
  timeout: 3000,
  headers: {
    Authorization: `Bearer ${BITGO_ACCESS_TOKEN}`,
  },
});

module.exports = axios;
