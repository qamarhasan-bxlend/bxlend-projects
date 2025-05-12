"use strict";

const {
    WithdrawTransaction
} = require("@src/models");
const {
    TRANSACTION_STATUS, CRYPTO_TRANSACTION_STATUS
} = require("@src/constants");
const { DBTransaction } = require("@src/utils");
const { Mailgun } = require('@src/lib');
const { Notification } = require('@src/models');

// ------------------------- Controller -------------------------


// expected body:
// "data": {
//     "event": "TRANSACTION_REQUEST",
//     "item": {
//       "blockchain": "tron",
//       "network": "nile",
//       "requestId": "65e89fd7e7684b8228dec633"
//     }
//   }


async function transactionRequest(data) {
    if (data.event !== "TRANSACTION_REQUEST") throw new Error("Invalid event type");

    const transaction = await DBTransaction.init();
    try {
        const { requestId } = data.item;
        let withdraw_transaction = await WithdrawTransaction.findOne(
            [
                {
                    vaultody_transaction_request_id: requestId,
                },
            ],
            { session: transaction.mongoose().session }
        );

        if (!withdraw_transaction) {
            return res.status(409).json({ message: 'transaction could not be found' })
            // throw new Error("Transaction could not be found");
        }
        //email if necessary

        await transaction.commit();

        return { message: "webhook received for transaction request" };

    } catch (error) {
        await transaction.abort(); // Ensure abort on error

    }
}
// ------------------------- Exports ----------------------------

module.exports = transactionRequest;
