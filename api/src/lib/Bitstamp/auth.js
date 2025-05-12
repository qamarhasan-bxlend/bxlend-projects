"use strict";
const querystring = require("querystring");
const {
  BITSTAMP_HTTP_API_URL,
  BITSTAMP_API_KEY,
  BITSTAMP_API_SECRET,
} = require("@src/config");
const crypto = require("crypto");
const uuid = require("uuid");

const api_key = BITSTAMP_API_KEY;
let API_SECRET = BITSTAMP_API_SECRET;
API_SECRET = Buffer.from(API_SECRET, "utf-8");

function generateHeaders(method, path, payload = "") {
  const timestamp = `${Date.now()}`;
  const nonce = uuid.v4();
  const content_type = "application/x-www-form-urlencoded";
  const payload_string = querystring.stringify(payload);
  const message = `BITSTAMP ${api_key}${method}${BITSTAMP_HTTP_API_URL.replace(
    /(^\w+:|^)\/\//,
    ""
  )}${path}${content_type}${nonce}${timestamp}v2${payload_string}`;

  const messageBuffer = Buffer.from(message, "utf-8");
  const signature = crypto
    .createHmac("sha256", API_SECRET)
    .update(messageBuffer)
    .digest("hex");

  let headers = {
    "X-Auth": `BITSTAMP ${api_key}`,
    "X-Auth-Signature": signature,
    "X-Auth-Nonce": nonce,
    "X-Auth-Timestamp": timestamp,
    "X-Auth-Version": "v2",
    "Content-Type": content_type,
  };
  return { headers, payload_string };
}

module.exports = generateHeaders;
