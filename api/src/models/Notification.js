"use strict";

const {
    MODEL: NAME, COLLECTION, TIMESTAMPS
} = require("@src/constants");

const { Schema, Types, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
    {
        user: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true,
        },
        readStatus: {
            type: Boolean,
            default: false
        },
    },
    {
        collection: COLLECTION.NOTIFICATIONS,
        timestamps: TIMESTAMPS
    }
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
    /**
     * Serialize notification object.
     *
     * @memberOf MODEL
     * @param {Object} notification
     * @returns {Object}
     */
    serialize(notification) {
        const {
            id,
            user,
            message,
            readStatus,
            created_at,
            updated_at,
        } = notification;

        return {
            id,
            user,
            message,
            readStatus,
            created_at,
            updated_at,
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
            "user",
            "message",
            "readStatus",
            "created_at",
            "updated_at",
        ];
    },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
    /**
     * Serialize Notification object.
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
     * Serialize notification object.
     *
     * @param {SCHEMA} doc
     * @returns {Object}
     */
    transform(doc) {
        return doc.serialize();
    },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.NOTIFICATIONS, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;