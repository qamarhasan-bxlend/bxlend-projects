"use strict";

const {
  MODEL: NAME,
  COLLECTION,
  TIMESTAMPS,
  OWNER,
  ORDER_KIND,
  ORDER_DIRECTION,
  ORDER_STATUS,
  DISCRIMINATOR,
  ORDER_REASON,
} = require("@src/constants");
const {
  assert: { isNumeric, isUuid },
} = require("@src/utils");
const { Schema, Types, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    [DISCRIMINATOR]: {
      type: String,
      enum: Object.values(ORDER_KIND),
      required: true,
    },
    owner_type: {
      type: String,
      required: true,
      enum: Object.values(OWNER),
    },
    owner: {
      type: Types.ObjectId,
      required: true,
      refPath: "owner_type",
    },
    pair_symbol: {
      type: String,
      required: true,
    },
    wallets: {
      type: [
        {
          type: Types.ObjectId,
          ref: NAME.WALLET,
        },
      ],
      required: true,
      validate: (value) => value.length === 2,
    },
    quantity: {
      type: Schema.Types.Decimal128,
      validate: isNumeric,
      get(value) {
        return value ? value.toString() : null;
      },
      set(value) {
        return Types.Decimal128.fromString(value.toString());
      },
    },
    amount: {
      type: Schema.Types.Decimal128,
      validate: isNumeric,
      get(value) {
        return value ? value.toString() : null;
      },
      set(value) {
       return Types.Decimal128.fromString(value.toString());
      },
    },

    direction: {
      type: String,
      required: true,
      enum: Object.values(ORDER_DIRECTION),
    },
    executed_price: {
      type: Schema.Types.Decimal128,
      validate: isNumeric,
      get(value) {
        return value ? value.toString() : null;
      },
      set(value) {
        return Types.Decimal128.fromString(value.toString());
      },
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    reason: {
      type: String,
      enum: Object.values(ORDER_REASON),
    },
    deleted_at: {
      // TODO: remove
      type: Date,
    },
    fee: {
      type: {
        percentage: {
          type: Number,
          required: true,
        },
        amount: {
          type: Schema.Types.Decimal128,
          required: true,
          validate: isNumeric,
          get(value) {
            return value?.toString();
          },
          set(value) {
            return Types.Decimal1m28.fromString(value);
          },
        },
      },
      required: true,
    },
    provider_info: {
      id: {
        type: String
      },
      fee : {
        type: Schema.Types.Decimal128,
        get(value) {
          return value?.toString();
        },
        set(value) {
          return Types.Decimal128.fromString(value);
        }
      },
      market: {
        type: String,
      },
      executed_price: {
        type: Schema.Types.Decimal128,
        get(value) {
          return value?.toString();
        },
        set(value) {
          return Types.Decimal128.fromString(value);
        }
      },
      datetime: {
        type: Date,
      },
      type: {
        type: String
      },
      amount: {
        type: Schema.Types.Decimal128,
        get(value) {
          return value?.toString();
        },
        set(value) {
          return Types.Decimal128.fromString(value);
        }
      }
    },
    // Scrypt metadata
    scrypt_data: {
      transaction_time: {
        type: Date,
      },
      order_id: {
        type: String,
        validate: isUuid,
        // required: true
      },
    },
  },
  {
    collection: COLLECTION.ORDER,
    timestamps: TIMESTAMPS,
    discriminatorKey: DISCRIMINATOR,
  }
);

// ------------------------- Statics ----------------------------

SCHEMA.static({
  /**
   * Serialize order object.
   *
   * @memberOf MODEL
   * @param {Object} order
   * @returns {Object}
   */
  serialize(order) {
    const {
      id,
      owner_type,
      owner,
      kind,
      pair,
      pair_symbol,
      wallets,
      amount,
      quantity,
      fee,
      direction,
      executed_price,
      status,
      provider_info,
      created_at,
      updated_at,
    } = order;

    return {
      id,
      owner_type,
      owner,
      kind,
      pair: pair ?? pair_symbol,
      wallets,
      amount,
      quantity,
      fee,
      direction,
      executed_price,
      status,
      provider_info,
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
      "owner_type",
      "owner",
      "kind",
      "pair_symbol",
      "wallets",
      "amount",
      "quantity",
      "fee",
      "direction",
      "executed_price",
      "status",
      "provider_info",
      "created_at",
      "updated_at",
    ];
  },
});

// ------------------------- Methods ----------------------------

SCHEMA.method({
  /**
   * Serialize order object.
   *
   * @memberOf SCHEMA.prototype
   * @returns {Object}
   */
  serialize() {
    return MODEL.serialize(this);
  },
});

// ------------------------- Relations --------------------------

SCHEMA.virtual("pair", {
  ref: NAME.CURRENCY_PAIR,
  localField: "pair_symbol",
  foreignField: "symbol",
  justOne: true,
});

SCHEMA.virtual("transactions", {
  ref: NAME.TRANSFER_TRANSACTION,
  localField: "_id",
  foreignField: "orders",
  justOne: false,
});

// ------------------------- Settings ---------------------------

SCHEMA.set("toJSON", {
  /**
   * Serialize order object.
   *
   * @param {SCHEMA} doc
   * @returns {Object}
   */
  transform(doc) {
    return doc.serialize();
  },
});

// ------------------------- Model ------------------------------

const MODEL = model(NAME.ORDER, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * tags:
 *   name: order_model
 *   x-displayName: The Order Model
 *   description: |
 *     <SchemaDefinition schemaRef="#/definitions/Order" showReadOnly={true} showWriteOnly={true} />
 *
 * definitions:
 *   Order:
 *     allOf:
 *       - $ref: "#/definitions/DBDocument"
 *       - type: object
 *         discriminator:
 *           propertyName: kind
 *           mapping:
 *             MARKET: "#/definitions/MarketOrder"
 *             LIMIT: "#/definitions/LimitOrder"
 *             STOP_LIMIT: "#/definitions/StopLimitOrder"
 *         required:
 *           - kind
 *           - owner_type
 *           - owner
 *           - pair
 *           - wallets
 *           - quantity
 *           - fee
 *           - direction
 *           - status
 *         properties:
 *           kind:
 *             description: Order kind
 *             type: string
 *             enum:
 *               - MARKET
 *               - LIMIT
 *               - STOP_LIMIT
 *           owner_type:
 *             description: Order owner type
 *             type: string
 *             enum:
 *               - User
 *               - Client
 *           owner:
 *             description: Order owner id
 *             type: string
 *             format: ObjectId
 *             example: "a1b2c3d"
 *           pair:
 *             description: Order currency pair
 *             type: string
 *             example: USDTETH
 *           wallets:
 *             description: Related wallets
 *             type: string
 *             items:
 *               type: string
 *               format: ObjectId
 *               example: "a1b2c3d"
 *           quantity:
 *             description: Order quantity
 *             type: string
 *             example: "2.23557"
 *           fee:
 *             description: Order fee
 *             type: object
 *             required:
 *               - percentage
 *               - amount
 *             properties:
 *               percentage:
 *                 description: Order fee percentage
 *                 type: number
 *                 format: float
 *                 example: 0.1
 *               amount:
 *                 description: Order fee amount
 *                 type: string
 *                 example: "0.0223557"
 *           direction:
 *             description: Order direction
 *             type: string
 *             enum:
 *               - BUY
 *               - SELL
 *           status:
 *             description: Order status
 *             type: string
 *             enum:
 *               - ACTIVE
 *               - FULFILLED
 *               - FAILED
 *               - CANCELLED
 *
 * parameters:
 *   order_id_parameter:
 *     description: The order identifier
 *     in: path
 *     name: order_id
 *     required: true
 *     schema:
 *       type: string
 *       format: ObjectId
 *       example: "a1b2c3d"
 *
 */
