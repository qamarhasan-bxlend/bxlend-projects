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
    to: {
      type: Types.ObjectId,
      required: true,
      ref: NAME.FIAT_WALLET,
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

// ------------------------- Settings ---------------------------

// ------------------------- Model ------------------------------

const MODEL = Transaction.discriminator(NAME.MANUAL_DEPOSIT_TRANSACTION, SCHEMA, TRANSACTION_KIND.MANUAL_DEPOSIT);

// ------------------------- Exports ----------------------------

module.exports = MODEL;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * definitions:
 *   ManualDepositTransaction:
 *     title: Manual Deposit Transaction
 *     allOf:
 *       - $ref: "#/definitions/Transaction"
 *       - type: object
 *         title: Manual Deposit Transaction
 *         required:
 *           - owner
 *           - to
 *         properties:
 *           owner:
 *             description: Creator of Transaction
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
 */
