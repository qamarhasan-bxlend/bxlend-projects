"use strict";

const { Schema, Types, model } = require("mongoose");
const { MODEL: NAME, COLLECTION,TIMESTAMPS } = require("@src/constants");

// ------------------------- Presale Users Schema -----------------------------

const SCHEMA = new Schema(
    {
        user_id: {
            type: Types.ObjectId,
            required: true,
            ref: NAME.USER,
        },
        total_allocation: {
            type: Number,
            required: true,
            default : 0
        },
        pending_allocation: {
            type: Number,
            required: true,
            default : 0
        },
        receiving_wallet: {
            type: String, 
        },
        referral_account: {
            type: String,
            ref: NAME.USER,
        },
        referral_reward: {
            token_allocation: {
                type: Number,
                default : 0
            },
        }
       
    },
    {
        collection: COLLECTION.PRESALE_USER,
        timestamps: TIMESTAMPS,
    }
);

const MODEL = model(NAME.PRESALE_USER, SCHEMA);

module.exports = MODEL