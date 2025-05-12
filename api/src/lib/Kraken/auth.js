"use strict";

const { KRAKEN_API_KEY, KRAKEN_PRIVATE_KEY } = require("@src/config");
const crypto = require('crypto');
const querystring = require('querystring');

// Function to get Kraken signature
function generateKrakenSignature(urlPath, data, secret) {
  let encoded;
  if (typeof data === 'string') {
    const jsonData = JSON.parse(data);
    encoded = jsonData.nonce + data;
  } else if (typeof data === 'object') {
    const dataStr = querystring.stringify(data);
    encoded = data.nonce + dataStr;
  } else {
    throw new Error('Invalid data type');
  }

  const sha256Hash = crypto.createHash('sha256').update(encoded).digest();
  const message = urlPath + sha256Hash.toString('binary');
  const secretBuffer = Buffer.from(secret, 'base64');
  const hmac = crypto.createHmac('sha512', secretBuffer);
  hmac.update(message, 'binary');
  const signature = hmac.digest('base64');

  return {
    "API-KEY": KRAKEN_API_KEY,
    "API-SIGN": signature,
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

// const apiSec = KRAKEN_PRIVATE_KEY;

// const payload = {
//   nonce: '1616492376594',
//   ordertype: 'limit',
//   pair: 'XBTUSD',
//   price: 37500,
//   type: 'buy',
//   volume: 1.25,
// };

// const signature = generateKrakenSignature('/0/private/AddOrder', payload, apiSec);
// console.log(`API-Sign: ${signature}`);

module.exports = generateKrakenSignature;
