"use strict";

const { MODEL: NAME, TRANSACTION_KIND, DISCRIMINATOR } = require("@src/constants");
const { Schema, Types } = require("mongoose");
const Transaction = require("./Transaction");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      required: true,
      ref: NAME.USER,
    },
    from: {
      type: Types.ObjectId,
      required: true,
      ref: NAME.FIAT_WALLET,
    },
    to: {
      type: Types.ObjectId,
      required: true,
      ref: NAME.BANK_ACCOUNT,
    },
    withdrawal_expiration: {
      type : Date,
      default : null
    },
    description: {
      type: String,
    },
    attachments: {
      type: [{
        type: String,
        required: true,
      }],
      default: [],
    },
    execution: {
      reason: {
        type: String,
        default: null,
      },
      isExecuted: {
        type: Boolean,
        default: false,
      },
      timestamp: {
        type: Date,
        default: null,
      },
      executor: {
        type: Types.ObjectId,
        ref: NAME.USER,
        default: null,
      },
    },
  },
  {
    discriminatorKey: DISCRIMINATOR,
  },
);

// ------------------------- Statics ----------------------------

// ------------------------- Methods ----------------------------

// ------------------------- Relations --------------------------

// SCHEMA.virtual("pair", {
//   ref: NAME.CURRENCY_PAIR,
//   localField: "pair_symbol",
//   foreignField: "symbol",
//   justOne: true,
// });

// ------------------------- Settings ---------------------------

// ------------------------- Model ------------------------------

const MODEL = Transaction.discriminator(NAME.MANUAL_WITHDRAW_TRANSACTION, SCHEMA, TRANSACTION_KIND.MANUAL_WITHDRAW);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   ManualWithdrawTransaction:
 *     title: Manual Withdraw Transaction
 *     allOf:
 *       - $ref: "#/definitions/Transaction"
 *       - type: object
 *         title: Manual Withdraw Transaction
 *         required:
 *           - owner
 *           - from
 *           - to
 *         properties:
 *           kind:
 *             default: MANUAL_WITHDRAW
 *           owner:
 *             description: Creator of Transaction
 *             type: string
 *             format: ObjectId
 *             example: "613a88885009ec387c562860"
 *           from:
 *             description: Source Bank Account
 *             type: string
 *             format: ObjectId
 *             example: "613a88885009ec387c562860"
 *           to:
 *             description: Target wallet
 *             type: string
 *             format: ObjectId
 *             example: "613a88885009ec387c562860"
 *           description:
 *             description: Description written for the executor
 *             type: string
 *             example: "This Transaction need some extra attention"
 *           attachments:
 *             description: Images attached to the Transaction ( Attachment Identifier )
 *             type: array
 *             items:
 *               type: string
 *               description: File identifier
 *               example: 6826612c-d202-4d0d-a4a7-a77c0526d441
 *               format: uuid
 *           execution:
 *             description: Execution state and data
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason to be failed
 *                 example: Insufficient Funds
 *               isExecuted:
 *                 type: boolean
 *                 description: Is the Transaction Executed?
 *                 example: true
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Execution date and time
 *                 example: 2017-07-21T17:32:28.000Z
 *               executor:
 *                 type: string
 *                 description: Executor Identifier
 *                 example: 613a88885009ec387c562860
 * 
 * 
 * parameters:
 *   attachment_id_parameter:
 *     description: The attachment identifier
 *     in: path
 *     name: attachment_id
 *     required: true
 *     schema:
 *       type: string
 *       format: uuid
 *       example: 6826612c-d202-4d0d-a4a7-a77c0526d441
 *
 */