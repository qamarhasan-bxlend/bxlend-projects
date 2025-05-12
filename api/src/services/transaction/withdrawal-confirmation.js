"use strict";

const { WithdrawTransaction } = require("@root/src/models");
const { CryptoApis } = require("@src/lib");
const { TRANSACTION_KIND, TRANSACTION_STATUS, CRYPTO_TRANSACTION_STATUS } = require('@src/constants')
const cron = require("node-cron");

const cronSchedule =  "*/30 * * * *";
let count = 0; // Initialize count

let job;

job = cron.schedule(cronSchedule, async () => {
    try {
        const withdraw_transactions = await WithdrawTransaction.find({
            kind: TRANSACTION_KIND.WITHDRAW,
            status: TRANSACTION_STATUS.PENDING,
        }).limit(1).sort({ created_at: -1 }); // TODO: ask shamil why the limit is zero?

        for (const transaction of withdraw_transactions) {
            console.log(transaction)
            if (transaction.crypto_api_transaction_request_id.length == 24) {
                var updatedTransaction;
                const data = await CryptoApis.getTransactionDetailByTransactionID(transaction.crypto_api_transaction_request_id)
                if (!data) {
                    console.log('No transaction Data yet');
                } else {
                    console.log(data)
                    const status = data.data.item.transactionRequestStatus
                    if (status == CRYPTO_TRANSACTION_STATUS.REJECTED || status == CRYPTO_TRANSACTION_STATUS.FAILED) {
                        updatedTransaction = await WithdrawTransaction.findOneAndUpdate(
                            { crypto_api_transaction_request_id: transaction.crypto_api_transaction_request_id },
                            { status: TRANSACTION_STATUS.FAILED },
                            { new: false }
                        );
                        // TODO: Update user's wallet with refunded amount
                    }
                    else if (status == CRYPTO_TRANSACTION_STATUS.BROADCASTED) {
                        updatedTransaction = await WithdrawTransaction.findOneAndUpdate(
                            { crypto_api_transaction_request_id: transaction.crypto_api_transaction_request_id },
                            { crypto_transaction_id: data.data.item.transactionId },
                            { new: false }
                        );
                    }
                    else if (status == CRYPTO_TRANSACTION_STATUS.MINED) {
                        const cryptoTransactionId = data.data.item.transactionId
                        const blockchain = data.data.item.blockchain
                        const network = data.data.item.network
                        console.log(cryptoTransactionId, blockchain, network)

                        const confirmationData = await CryptoApis.getTransactionConfirmation(blockchain, network, cryptoTransactionId)
                        console.log(confirmationData)
                        if(confirmationData.data.item.isConfirmed){
                            try {
                                updatedTransaction = await WithdrawTransaction.findOneAndUpdate(
                                    { crypto_api_transaction_request_id: transaction.crypto_api_transaction_request_id },
                                    { status: TRANSACTION_STATUS.SUCCESS, crypto_transaction_id: cryptoTransactionId },
                                    { new: false }
                                );
                            } catch (error) {
                                // TODO: Handle proper error here
                            }
                        }
                    }
                    else{
                        continue;
                    }
                }
            }
        }
    } catch (error) {
        console.log("Error updating withdrawal transaction records:", error.error.details);
    }
});
