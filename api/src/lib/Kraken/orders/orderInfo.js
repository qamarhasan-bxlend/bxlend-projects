const krakenClient = require("../client");
const generateKrakenSignature = require("../auth");
const { HTTP_VERBS } = require("@src/constants");
const Axios = require("axios");
const querystring = require("querystring");
const { KRAKEN_PRIVATE_KEY, KRAKEN_HTTP_API_URL } = require("@src/config");


// Function to get market order info
async function getInfo(input) {
  const { txid } = input;

  const data = {
    txid,  // id of transaction
    nonce: Date.now().toString()  // Timestamp in milliseconds as nonce
  };

  const headers = generateKrakenSignature("/0/private/QueryOrders", data, KRAKEN_PRIVATE_KEY);

  try {
    const response = await Axios.post(
      `${KRAKEN_HTTP_API_URL}/0/private/QueryOrders`,
      querystring.stringify(data),
      { headers }
    );

    if (response.status === 200 && response.data.error.length === 0) {
      // console.log("Order Information fetched successfully:", JSON.stringify(response.data.result));
      return response.data.result;
    } else {
      console.log(response)
      // throw new Error("Error placing market order on Kraken: " + response.data.error.join(", "));
    }
  } catch (error) {
    throw error;
  }
}


module.exports = {
  getInfo,
};
