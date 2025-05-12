"use strict";

const {
    WithdrawTransaction, CryptoWallet
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
//     "event": "TRANSACTION_REJECTED",
//     "item": {
//       "blockchain": "tron",
//       "network": "nile",
//       "requestId": "65e069a6e7684b8228ff583a",
//       "requiredApprovals": 1,
//       "requiredRejections": 1,
//       "currentApprovals": 0,
//       "currentRejections": 1
//     }
//   }
// }


async function transactionRejected(data) {
    if (data.event !== "TRANSACTION_REJECTED") throw new Error("Invalid event type");

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

        withdraw_transaction.status = TRANSACTION_STATUS.REJECTED;
        await withdraw_transaction.save({ session: transaction.mongoose().session })

        const userWallet = await CryptoWallet.findOne({
            owner: withdraw_transaction.from,
            deleted_at: { $exists: false },
            currency_code: withdraw_transaction.currency_code
        }).session(transaction.mongoose().session);

        userWallet.available_balance = new BigNumber(withdraw_transaction.available_balance)
            .minus(withdraw_transaction.quantity).minus(withdraw_transaction.fee)
            .toFixed();
        await userWallet.save({ session: transaction.mongoose().session })


        await Notification.create({
            user: withdraw_transaction.from,
            title: "your transaction has been rejected",
            message: `Withdrawal of ${withdraw_transaction.quantity} ${withdraw_transaction.currency_code} has been rejected.`
        });

        await transaction.commit();
        //email if necessary
        return { message: "webhook received for transaction rejection" };


    } catch (error) {
        if (transaction) await transaction.abort();
        console.log(error);
        console.error("Error in transaction:", JSON.stringify(error));

    }
}
// ------------------------- Exports ----------------------------

module.exports = transactionRejected;
