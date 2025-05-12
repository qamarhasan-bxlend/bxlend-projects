"use strict";

const { MODEL: NAME, COLLECTION, TIMESTAMPS } = require("@src/constants");
const { Schema, Types, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
    {
        unit: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        network: {
            type: String,
            required: true,
        },
        standard_fee: {
            type: Schema.Types.Decimal128,
            required: true,
            get(value) {
                return value?.toString();
            },
            set(value) {

                return value
                    ? Types.Decimal128.fromString(value)
                    : Types.Decimal128.fromString("0");
            },
        },
        fast_fee: {
            type: Schema.Types.Decimal128,
            required: true,
            get(value) {
                return value?.toString();
            },
            set(value) {

                return value
                    ? Types.Decimal128.fromString(value)
                    : Types.Decimal128.fromString("0");
            },
        },
        slow_fee: {
            required: true,
            type: Schema.Types.Decimal128,
            get(value) {
                return value?.toString();
            },
            set(value) {

                return value
                    ? Types.Decimal128.fromString(value)
                    : Types.Decimal128.fromString("0");
            },
        },
        deleted_at: {
            type: Date,
        },
    },
    {
        collection: COLLECTION.TRANSACTION_FEE,
        timestamps: TIMESTAMPS,
    },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
    /**
     * Serialize unit transaction_fee object.
     *
     * @memberOf MODEL
     * @param {Object} transaction_fee
     * @returns {Object}
     */
    serialize(transaction_fee) {
        const {
            id,
            unit,
            code,
            fast_fee,
            network,
            slow_fee,
            standard_fee,
            created_at,
            updated_at,
        } = transaction_fee;

        const serialized = {
            id,
            unit: unit,
            code: code,
            fast_fee: fast_fee,
            network: network,
            slow_fee: slow_fee,
            standard_fee: standard_fee,
            created_at: created_at,
            updated_at: updated_at,
        };

        return serialized;
    },

    /**
     * Returns fields that can be selected by query parameters.
     *
     * @returns {string[]}
     */
    getSelectableFields() {
        return ["id", "unit", "code", "network", "fast_fee", "slow_fee", "standard_fee", "created_at", "updated_at"];
    }
});


// ------------------------- Methods ----------------------------

SCHEMA.method({
    /**
     * Serialize transaction_fee object.
     *
     * @memberOf SCHEMA.prototype
     * @returns {Object}
     */
    serialize() {
        return MODEL.serialize(this);
    },
});

// ------------------------- Settings ---------------------------

SCHEMA.set("toJSON", {
    /**
     * Serialize object.
     *
     * @param {SCHEMA} doc
     * @returns {Object}
     */
    transform(doc) {
        return doc.serialize();
    },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.TRANSACTION_FEE, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;
