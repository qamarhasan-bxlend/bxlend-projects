const krakenClient = require("../client");
const generateKrakenSignature = require("../auth");
const { HTTP_VERBS } = require("@src/constants");
const Axios = require("axios");
const querystring = require("querystring");
const {  KRAKEN_PRIVATE_KEY ,KRAKEN_HTTP_API_URL} = require("@src/config");


// Function to create market order
async function create(input) {
  const { orderQty, clOrdID, marketSymbol, orderKind } = input;

  // Ensure the correct parameters are being sent
  const data = {
    pair: marketSymbol,  // e.g., XBTUSD
    type: orderKind,     // e.g., buy or sell
    ordertype: "market", // For market order
    volume: orderQty,    // Amount to buy/sell
    client_order_id: clOrdID,  // Optional client order ID
    nonce: Date.now().toString()  // Timestamp in milliseconds as nonce
  };

  const headers = generateKrakenSignature("/0/private/AddOrder", data,KRAKEN_PRIVATE_KEY);

  try {
    const response = await Axios.post(
      `${KRAKEN_HTTP_API_URL}/0/private/AddOrder`,
      querystring.stringify(data),
      { headers }
    );

    if (response.status === 200 && response.data.error.length === 0) {
      // console.log("Market order placed successfully:", JSON.stringify(response.data.result));
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
  create,
};
