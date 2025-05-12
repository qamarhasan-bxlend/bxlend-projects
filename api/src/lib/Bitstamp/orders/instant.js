// NOTE : Market Order On Client-Side is implemented using Instant Order Creation to deduct amount according to our need

const client = require("../client");
const generateHeaders = require("../auth");
const { HTTP_VERBS } = require("@src/constants");

// TODO change amount value to orderQty

async function create(input) {
  try {
    const { orderQty, clOrdID, marketSymbol, orderKind } = input;

    const method = HTTP_VERBS.POST;
    const path = `/api/v2/${orderKind}/instant/${marketSymbol}/`;
    const payload = {
      amount: orderQty,
      client_order_id: clOrdID,
      offset: "1",
    };

    const { headers, payload_string } = generateHeaders(method, path, payload);

    const response = await client.post(path, payload_string, {
      headers,
    });

    if (response.status != 200) {
      throw new Error("Error in making request");
    }
    else if (response.data.status == "error") {
      if(response.data.reason.amount)
      throw new Error(response.data.reason.amount)
      throw new Error(response.data.reason.__all__?response.data.reason.__all__:response.data.reason);
    }
    return response.data;
  } catch (error) {
    throw error; 
  }
}

module.exports = {
  create,
};
