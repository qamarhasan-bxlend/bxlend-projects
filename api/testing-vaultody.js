const axios = require('axios');
const CryptoJS = require('crypto-js');

// Replace with your credentials
const secretKey = '5fe5e30b74774dfd0c7ec8440fa8b7909458e7d4';
const secret = '+4HzRsB7WKtS9Q==';
const passphrase = 'Password.123';
const baseUrl = 'https://rest.vaultody.com/vaults/66f3d7c605a2350007d00102/bitcoin/testnet/addresses'; // Update with the actual endpoint
const body = JSON.stringify({
  "context": "Testing",
  "data": {
    "item": {
      "label": "Testing"
    }
  }
});

const timestamp = Math.floor(Date.now()/1000).toString();
const regex = /\n(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
var reqObj = {
    method: "POST",
    path: "/vaults/66f3d7c605a2350007d00102/bitcoin/testnet/addresses",
    // body:  JSON.stringify({}) ,
    body: body.replace(regex, '').replace(/(".*?")|\s+/g, '$1'),
    query: JSON.stringify({})
};

// const transformedQueryObject = reqObj.query.reduce((result, item) => {
//     result[item.key] = item.value;
//     return result;
// }, {});

var messageToSign = timestamp + reqObj.method + reqObj.path + reqObj.body + JSON.stringify({});
// Decoding the Base64 secret
const key = CryptoJS.enc.Base64.parse(secret);
// Creating a SHA-256 HMAC with the secret key
const hmac = CryptoJS.HmacSHA256(messageToSign, key);
// Base64 encoding the result
const signature = CryptoJS.enc.Base64.stringify(hmac);


// Set headers
const headers = {
    "x-api-timestamp": timestamp,
    "x-api-sign": signature,
    "x-api-key": secretKey,
    "x-api-passphrase": passphrase,
    "Content-Type": "application/json"
  };

// headers.add({
//     key: "x-api-timestamp",
//     value: timestamp
// });
// headers.add({
//     key: "x-api-sign",
//     value: signature
// });
// headers.add({
//     key: "x-api-key",
//     value: secretKey.toString()
// });
// headers.add({
//     key: "x-api-passphrase",
//     value: passphrase
// });
// headers.add({
//     key: "Content-Type",
//     value: 'application/json'
// });

// Fetch vaults
// axios.get(baseUrl, { headers })
//   .then(response => {
//     console.log('Vaults fetched successfully:', response.data);
//     console.log('Response Body:', response.data.data);
//   })
//   .catch(error => {
//     console.error('Error fetching vaults:', error.response ? error.response.data : error.message);
//   });

  // Fetch vaults
axios.post(baseUrl, body, { headers })
.then(response => {
  console.log('Vaults fetched successfully:', response.data);
  console.log('Response Body:', response.data.data);
})
.catch(error => {
  console.error('Error fetching vaults:', error.response ? error.response.data : error.message);
});
