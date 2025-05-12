"use strict";

/* istanbul ignore file */

const Axios = require("axios");
const { SCRYPT_HTTPS_URI, SCRYPT_API_KEY, SCRYPT_API_SECRET } = require("@src/config");
const { get_http_headers } = require("@src/lib/Scrypt/helpers/headers")
// Defining key
const secret = SCRYPT_API_SECRET;
const api_key = SCRYPT_API_KEY
const https_url = SCRYPT_HTTPS_URI;

const axios = Axios.create({
  baseURL: https_url,
  timeout: 5000,
  // headers: get_http_headers(url, api_key, secret),
});

module.exports = axios;
