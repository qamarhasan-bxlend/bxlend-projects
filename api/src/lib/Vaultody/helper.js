const axios = require('axios');
const CryptoJS = require('crypto-js');

const { VAULTODY_API_KEY, VAULTODY_API_SECRET, VAULTODY_API_PASSPHRASE } = require("@src/config");

function getVaultodyHeaders(method, path, body, query) {
  // Replace with your credentials
  const secretKey = VAULTODY_API_KEY;
  const secret = VAULTODY_API_SECRET;
  const passphrase = VAULTODY_API_PASSPHRASE;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const regex = /\n(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
  var reqObj = {
    method: method,
    path: path,
    body: method === 'GET' ? JSON.stringify({}) : JSON.stringify(body).replace(regex, '').replace(/(".*?")|\s+/g, '$1'),
    query: query ? query : JSON.stringify({})
  };

  const transformedQueryObject = {};
  // TODO:
  // const transformedQueryObject = reqObj.query.reduce((result, item) => {
  //     result[item.key] = item.value;
  //     return result;
  // }, {});

  var messageToSign = timestamp + reqObj.method + reqObj.path + reqObj.body + JSON.stringify(transformedQueryObject);
  // Decoding the Base64 secret
  const key = CryptoJS.enc.Base64.parse(secret);
  // Creating a SHA-256 HMAC with the secret key
  const hmac = CryptoJS.HmacSHA256(messageToSign, key);
  // Base64 encoding the result
  const signature = CryptoJS.enc.Base64.stringify(hmac);

  // Set headers
  const updated_headers = {
    "x-api-timestamp": timestamp,
    "x-api-sign": signature,
    "x-api-key": secretKey,
    "x-api-passphrase": passphrase,
    "Content-Type": "application/json"
  };

  return updated_headers;
}


module.exports = { getVaultodyHeaders };