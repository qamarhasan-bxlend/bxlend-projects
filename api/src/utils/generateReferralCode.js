"use strict";

const { User } = require("@src/models");

// ------------------------- Service -------------------------

async function generateUniqueReferralCode() {
    try {
        let uniqueReferral;
        let isUnique = false;

        while (!isUnique) {
            uniqueReferral = Math.floor(100000000 + Math.random() * 900000000).toString();
            const existingReferralCode = await User.findOne({
                where: { bxlend_id: uniqueReferral },
            });

            if (!existingReferralCode) {
                isUnique = true;
            }
        }
        return uniqueReferral;
    } catch (err) {
        console.error(err);
        throw new Error(
            "An error occurred while creating a unique referral code."
        );
    }
}

// ------------------------- Exports -------------------------

module.exports = generateUniqueReferralCode;
