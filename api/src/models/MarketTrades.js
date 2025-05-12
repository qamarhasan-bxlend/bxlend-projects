const { MODEL: NAME, COLLECTION, TIMESTAMPS, } = require("@src/constants");
const { Schema, model } = require("mongoose");


const SCHEMA = new Schema(
    {
        symbol: {
            type: String,
            required: true
        },
        trades: [{
            amount: { type: String },
            date: { type: String },
            price: { type: String },
            tid: { type: String },
            type: { type: String },
        }]
    },
    {
        collection: COLLECTION.MARKET_TRADES,
        timestamps: TIMESTAMPS
    },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
    /**
     * Serialize MarketTrades object.
     *
     * @memberOf MODEL
     * @param {Object} market_trades
     * @returns {Object}
     */
    serialize(market_trades) {
        const {
            id,
            amount,
            date,
            price,
            type,
            tid,
            updated_at,
            created_at,
        } = market_trades;

        return {
            id,
            amount,
            date,
            price,
            type,
            tid,
            updated_at,
            created_at,
        };
    },

    /**
     * Returns fields that can be selected by query parameters.
     *
     * @returns {string[]}
     */
    getSelectableFields() {
        return [
            "id",
            "amount",
            "date",
            "price",
            "type",
            "tid",
            "updated_at",
            "created_at",
        ];
    },
});


// ------------------------- Settings ---------------------------

// SCHEMA.set("toJSON", {
//     /**
//      * Serialize order object.
//      *
//      * @param {SCHEMA} doc
//      * @returns {Object}
//      */
//     transform(doc) {
//         return doc.serialize();
//     },
// });

// ------------------------- Model ------------------------------

const MODEL = model(NAME.MARKET_TRADES, SCHEMA);

// ------------------------- Exports ----------------------------
module.exports = MODEL;
