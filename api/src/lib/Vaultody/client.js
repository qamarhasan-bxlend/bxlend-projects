"use strict";

/* istanbul ignore file */

const Axios = require("axios");
const { VAULTODY_API_URI } = require("@src/config");

const axios = Axios.create({
  baseURL: VAULTODY_API_URI,
  timeout: 10000,
});

module.exports = axios;
