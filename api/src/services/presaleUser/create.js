"use strict";

const { PresaleUser } = require("@src/models");

// ------------------------- Service -------------------------

/**
 * This service is responsible for creating a Presale User in the system.
 *
 * @param {{
*   user: Object,
*   currency_code: String,
* }} input
* @param {import("@src/utils/DBTransaction").DBTransaction=} DBT
* @returns {Promise<Object>}
*/

async function createPresaleUser(input, DBT) {
    const { user, receiving_wallet, referral_account } = input;

    try {
        const newPresaleUser = await PresaleUser.create({
            user_id: user._id,
            receiving_wallet: receiving_wallet,
            referral_account : referral_account
        });

        return newPresaleUser;
    } catch (err) {
        console.log(err);
        throw new Error(
            "An error occurred while creating the Presale User. Please contact customer support."
        );
    }
}


// ------------------------- Exports -------------------------

module.exports = createPresaleUser;
