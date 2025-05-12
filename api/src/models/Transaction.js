"use strict";

const {
  MODEL: NAME,
  COLLECTION,
  TIMESTAMPS,
  TRANSACTION_KIND,
  TRANSACTION_STATUS,
  CRYPTO_TRANSACTION_STATUS,
  DISCRIMINATOR,
} = require("@src/constants");
const { assert: { isNumeric } } = require("@src/utils");
const { Schema, model, Types } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    [DISCRIMINATOR]: {
      type: String,
      enum: Object.values(TRANSACTION_KIND),
      required: true,
    },
    currency_code: {
      type: String,
      required: true,
    },
    quantity: {
      type: Schema.Types.Decimal128,
      required: true,
      validate: isNumeric,
      get(value) {
        return value?.toString();
      },
      set(value) {
        return Types.Decimal128.fromString(value);
      },
    },
    status: {
      type: String,
      enum: Object.values(CRYPTO_TRANSACTION_STATUS),
      required: true,
    },
  },
  {
    collection: COLLECTION.TRANSACTION,
    timestamps: TIMESTAMPS,
    discriminatorKey: DISCRIMINATOR,
  },
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize transaction object.
   *
   * @memberOf MODEL
   * @param {Object} transaction
   * @returns {Object}
   */
  serialize(transaction) {
    const {
      id,
      kind,
      currency,
      currency_code,
      quantity,
      status,
      created_at,
      updated_at,
    } = transaction;

    const serialized = {
      id,
      kind,
      currency: currency ?? currency_code,
      quantity,
    };

    switch (kind) {
      case TRANSACTION_KIND.DEPOSIT:
        serialized.to = transaction.to;
        break;
      case TRANSACTION_KIND.TRANSFER:
        serialized.from = transaction.from;
        serialized.to = transaction.to;
        serialized.orders = transaction.orders;
        serialized.pair = transaction.pair ?? transaction.pair_symbol;
        serialized.price = transaction.price;
        break;
      case TRANSACTION_KIND.WITHDRAW:
        serialized.from = transaction.from;
        serialized.recipient_address = transaction.recipient_address;
        serialized.crypto_api_transaction_request_id = transaction.crypto_api_transaction_request_id;
        break;
      case TRANSACTION_KIND.MANUAL_DEPOSIT:
        serialized.owner = transaction.owner;
        serialized.to = transaction.to;
        serialized.description = transaction.description;
        serialized.execution = transaction.execution;
        serialized.attachments = transaction.attachments;
        break;
      case TRANSACTION_KIND.MANUAL_WITHDRAW:
        serialized.owner = transaction.owner;
        serialized.from = transaction.from;
        serialized.to = transaction.to;
        serialized.description = transaction.description;
        serialized.execution = transaction.execution;
        serialized.attachments = transaction.attachments;
        serialized.withdrawal_expiration = transaction.withdrawal_expiration;
        break;
    }

    serialized.status = status;
    serialized.created_at = created_at;
    serialized.updated_at = updated_at;

    return serialized;
  },

  /**
   * Returns fields that can be selected by query parameters.
   *
   * @returns {string[]}
   */
  getSelectableFields() {
    return [
      "id",
      "kind",
      "currency",
      "quantity",
      "from",
      "to",
      "orders",
      "pair",
      "price",
      "status",
      "created_at",
      "updated_at",
    ];
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize transaction object.
   *
   * @memberOf SCHEMA.prototype
   * @returns {Object}
   */
  serialize() {
    return MODEL.serialize(this);
  },
});

// ------------------------- Relations --------------------------

SCHEMA.virtual("currency", {
  ref: NAME.CURRENCY,
  localField: "currency_code",
  foreignField: "code",
  justOne: true,
});

// ------------------------- Settings ---------------------------

SCHEMA.set("toJSON", {
  /**
   * Serialize transaction object.
   *
   * @param {SCHEMA} doc
   * @returns {Object}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.TRANSACTION, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * tags:
 *   name: transaction_model
 *   x-displayName: The Transaction Model
 *   description: |
 *     <SchemaDefinition schemaRef="#/definitions/Transaction" showReadOnly={true} showWriteOnly={true} />
 *
 * definitions:
 *   Transaction:
 *     allOf:
 *       - $ref: "#/definitions/DBDocument"
 *       - type: object
 *         discriminator:
 *           propertyName: kind
 *           mapping:
 *             DEPOSIT: "#/definitions/DepositTransaction"
 *             TRANSFER: "#/definitions/TransferTransaction"
 *             WITHDRAW: "#/definitions/WithdrawTransaction"
 *             MANUAL_WITHDRAW: "#/definitions/ManualWithdrawTransaction"
 *             MANUAL_DEPOSIT: "#/definitions/ManualDepositTransaction"
 *         required:
 *           - kind
 *           - currency
 *           - quantity
 *           - status
 *         properties:
 *           kind:
 *             description: Transaction kind
 *             type: string
 *             enum:
 *               - DEPOSIT
 *               - TRANSFER
 *               - WITHDRAW
 *               - MANUAL_WITHDRAW
 *               - MANUAL_DEPOSIT
 *           currency:
 *             description: Transaction currency
 *             type: string
 *             example: ETH
 *           quantity:
 *             description: Transaction quantity
 *             type: string
 *             example: "2.23557"
 *           status:
 *             description: Transaction status
 *             type: string
 *             enum:
 *               - PENDING
 *               - SUCCESS
 *               - FAILED
 *               - EXPIRED
 *
 * parameters:
 *   transaction_id_parameter:
 *     description: The transaction identifier
 *     in: path
 *     name: transaction_id
 *     required: true
 *     schema:
 *       type: string
 *       format: ObjectId
 *       example: "a1b2c3d"
 *
 */
