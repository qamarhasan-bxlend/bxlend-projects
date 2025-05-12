"use strict";

/* istanbul ignore file */

const client = require("../client");
const responseHandler = require("../responseHandler");
const { CRYPTOAPIS_WALLET_ID, CRYPTOAPIS_WEBHOOK_URL, CRYPTOAPIS_CALLBACK_SECRET_KEY } = require("@src/config");
const {CRYPTOAPIS_TRANSACTION_WALLET_FEE_PRIORITY} = require('@src/constants')


function create(blockchain, network, address, amount) {
  return responseHandler(
    client.post(
      `/wallet-as-a-service/wallets/${CRYPTOAPIS_WALLET_ID}/${blockchain}/${network}/transaction-requests`,
      {
        data: {
          item: {
            // callbackSecretKey: CRYPTOAPIS_CALLBACK_SECRET_KEY,
            // callbackUrl: `${CRYPTOAPIS_WEBHOOK_URL}/v1/webhook/callback/coin-transaction-request`,
            feePriority: CRYPTOAPIS_TRANSACTION_WALLET_FEE_PRIORITY.STANDARD,
            recipients: [
              {
                address: address,
                amount: amount,
              },
            ],
          },
        },
      }
    )
  );
}

module.exports = {
  create,
};
