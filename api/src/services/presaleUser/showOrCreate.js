"use strict";

const showPresaleUser = require("./show");
const createPresaleUser = require("./create");

async function showOrCreatePresaleUser(input, DBT) {
    const { user, receiving_wallet, referral_account } = input;
    try {
        let presaleUser = await showPresaleUser({ user }, DBT);

        if (!presaleUser) {
            presaleUser = await createPresaleUser({ user, receiving_wallet, referral_account }, DBT);
        }
        return presaleUser;

    }
    catch (error) {
        console.log(error)
        throw new Error(error.message)

    }

}

// ------------------------- Exports -------------------------

module.exports = showOrCreatePresaleUser;
