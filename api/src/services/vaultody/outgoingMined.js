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
//     "event": "OUTGOING_MINED",
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

async function outgoingMined(data) {
    if (data.event !== "OUTGOING_MINED") throw new Error("Invalid event type");

    const transaction = await DBTransaction.init();
    try {
        const { requestId,transactionId } = data.item;
        
        let withdraw_transaction = await WithdrawTransaction.findOneAndUpdate(
            { 
                vaultody_transaction_request_id: requestId, 
                vaultody_transaction_id: transactionId 
            },
            { status: CRYPTO_TRANSACTION_STATUS.MINED },
            { new: true, session: transaction.mongoose().session }
        ).select("id from quantity currency_code");

        if (!withdraw_transaction) {
            throw new Error('transaction not found')
            return res.status(409).json({ message: 'transaction could not be found' })
        }

        withdraw_transaction.status = CRYPTO_TRANSACTION_STATUS.MINED;
        await withdraw_transaction.save({ session: transaction.mongoose().session })
        await Notification.create({
            user: withdraw_transaction.from,
            title : "outgoing transaction has been mined",
            message: `Withdrawal of ${withdraw_transaction.quantity} ${withdraw_transaction.currency_code} has been Mined.`
        });

        //email if necessary

        await transaction.commit();
        return { message: "webhook received for transaction mined" };

    } catch (error) {
        console.log(error)
        await transaction.abort(); // Ensure abort on error
    }
}
// ------------------------- Exports ----------------------------

module.exports = outgoingMined;
