"use strict";

const { PresaleTransaction, PresaleUser, User, PresaleTokenSetup, Setting } = require("@root/src/models");
const { CryptoApis } = require("@src/lib");
const { SETTING } = require('@src/constants')
const cron = require("node-cron");

const cronSchedule = "*/5 * * * * *";

let job;

job = cron.schedule(cronSchedule, async () => {
    try {
        // const tokenSetup = await PresaleTokenSetup.findOne();
        // let updatedTotalAllocation = 0;

        // fetch bonus percentage from the Setting database
        const referredByUsers = await User.aggregate([
            {
                $match: {
                    referred_by: { $exists: true }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "referred_by",
                    foreignField: "bxlend_id",
                    as: "referrer"
                }
            },
            {
                $unwind: "$referrer"
            },
            {
                $group: {
                    _id: "$referrer._id",
                    referrer: { $first: "$referrer" },
                    referred_users: { $push: "$_id" }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    referrer: 1,
                    referred_users: 1
                }
            }
        ]);
        const { value: presaleBonusvalue } = await Setting.findOne({ name: SETTING.REFERRAL_REWARD });
        if(!presaleBonusvalue) {
            console.log('No referral reward value found in the settings');
            return;
        }

        const updatedBonus = await Promise.all(referredByUsers.map(async (user) => {
            const referredUsers = await PresaleUser.find({ user_id: { $in: user.referred_users } });

            const referredValidPurchases = referredUsers.reduce((acc, user) => acc + (user.total_allocation || 0), 0);
            const bonus = referredValidPurchases * presaleBonusvalue; // must not be hard coded value

            const referralUser = await PresaleUser.findOneAndUpdate(
                { user_id: user._id },
                { $set: { "referral_reward.token_allocation": bonus } },
                { new: false }
            );

            if (!referralUser) {
                return null;
            }
            // un-comment from 65 - 77 , if you want to update the total allocation of the presale setup

            // if (bonus > (referralUser.referral_reward?.token_allocation || 0)) {
            // const updatedBonus = bonus - referralUser.referral_reward.token_allocation;
            // updatedTotalAllocation += updatedBonus;

            // console.log('Bonus is greater than previous referral reward');
            // } else {
            // console.log('Bonus same as previous referral reward');
            // }
        }))
        // tokenSetup.purchased_tokens += updatedTotalAllocation;
        // await tokenSetup.save();

    } catch (error) {
        console.log("Error updating withdrawal transaction records:", error.error.details);
    }
});
