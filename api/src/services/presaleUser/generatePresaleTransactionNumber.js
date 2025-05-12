"use strict";

const { PresaleTransaction } = require("@src/models");
const crypto = require("crypto");

// ------------------------- Service -------------------------

async function generateUniquePresaleTransactionNumber() {
    try {
        let uniqueNumber;
        let isUnique = false;

        while (!isUnique) {
            uniqueNumber = crypto.randomBytes(6).toString("hex").slice(0, 12).toUpperCase();

            const existingTransaction = await PresaleTransaction.findOne({
                where: { transaction_number: uniqueNumber },
            });

            if (!existingTransaction) {
                isUnique = true;
            }
        }

        return uniqueNumber;
    } catch (err) {
        console.error(err);
        throw new Error(
            "An error occurred while creating a unique transaction number."
        );
    }
}

// ------------------------- Exports -------------------------

module.exports = generateUniquePresaleTransactionNumber;
