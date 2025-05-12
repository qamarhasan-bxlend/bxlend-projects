"use strict";

const {
    WithdrawTransaction
} = require("@src/models");
const {
    TRANSACTION_STATUS,CRYPTO_TRANSACTION_STATUS
} = require("@src/constants");
const { DBTransaction } = require("@src/utils");
const { Mailgun } = require('@src/lib');
const { Notification } = require('@src/models');

// ------------------------- Controller -------------------------


// expected body:
// "data": {
//     "event": "TRANSACTION_APPROVED",
//     "item": {
//       "blockchain": "tron",
//       "network": "nile",
//       "requestId": "65e89fd7e7684b8228dec633",
//       "requiredApprovals": 1,
//       "requiredRejections": 1,
//       "currentApprovals": 1,
//       "currentRejections": 0
//     }
// } 

async function transactionApproval(data) {
    if (data.event !== "TRANSACTION_APPROVED") throw new Error("Invalid event type");

    const transaction = await DBTransaction.init();
    try {
        const { blockchain, network, requestId } = data.item;
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
       
        withdraw_transaction.status = CRYPTO_TRANSACTION_STATUS.SUCCESS;
        await withdraw_transaction.save({ session: transaction.mongoose().session })
        await Notification.create({
            user: withdraw_transaction.from,
            title : "transaction has been approved",
            message: `Withdrawal of ${withdraw_transaction.quantity} ${withdraw_transaction.currency_code} has been approved.`
        });

        //email if necessary
        await transaction.commit();

        return { message: "webhook received for transaction approval" };
    } catch (error) {
        console.log(error)
        await transaction.abort(); // Ensure abort on error
  
    }
}
// ------------------------- Exports ----------------------------

module.exports = transactionApproval;
