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
//     "event": "TRANSACTION_BROADCASTED",
//     "item": {
//       "blockchain": "tron",
//       "network": "nile",
//       "requestId": "65e89fd7e7684b8228dec633",
//       "requiredApprovals": 1,
//       "requiredRejections": 1,
//       "currentApprovals": 1,
//       "currentRejections": 0,
//       "transactionId": "f0509c32db54a723b2934f36964ad67f8ababd2944438c4c4c7ebd140b95f8de"
//     }
//   }

async function transactionBroadcasted(data) {
    if (data.event !== "TRANSACTION_BROADCASTED") throw new Error("Invalid event type");

    const transaction = await DBTransaction.init();
    try {
        const { requestId, transactionId } = data.item;
        let withdraw_transaction = await WithdrawTransaction.findOne(
            {
                vaultody_transaction_request_id: requestId,
            }
        );
     
        if (!withdraw_transaction) {
            return res.status(409).json({ message: 'transaction could not be found' })
            // throw new Error("Transaction could not be found");
        }
        if (withdraw_transaction.status == CRYPTO_TRANSACTION_STATUS.PENDING) {
            await Notification.create({
                user: withdraw_transaction.from,
                title: "Incoming transaction got broadcasted",
                message: `Withdrawal of ${withdraw_transaction.quantity} ${withdraw_transaction.currency_code} has been approved.`
            });
            withdraw_transaction.status = CRYPTO_TRANSACTION_STATUS.BROADCASTED;
            withdraw_transaction.vaultody_transaction_id = transactionId
        }

        await withdraw_transaction.save({ session: transaction.mongoose().session })
        await transaction.commit();
        //email if necessary

        return { message: "webhook received for transaction broadcasted" };
    } catch (error) {
        console.log(error)
        await transaction.abort(); // Ensure abort on error
  
    }
}
// ------------------------- Exports ----------------------------

module.exports = transactionBroadcasted;
