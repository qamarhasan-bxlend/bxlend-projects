"use strict";

const validate = require("@root/src/middlewares/validator");
const {
  ManualDepositTransaction,
  ManualWithdrawTransaction,
  Transaction,
} = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");
const { TRANSACTION_KIND, ORDER_DIRECTION, OWNER } = require("@src/constants");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    query: Joi.object().keys({
      pair: Joi.string(),
      type: Joi.string().valid(...Object.keys(ORDER_DIRECTION)),
      owner_type: Joi.string().valid(...Object.keys(OWNER)),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      select: Joi.array()
        .items(
          Joi.string()
            .valid(...ManualDepositTransaction.getSelectableFields())
            .valid(...ManualWithdrawTransaction.getSelectableFields())
        )
        .default([]),
    }),
  }),
  async function listManualTransactionsV1Controller(req, res) {
    const {
      user,
      query: { page, limit, pair, type, owner_type },
    } = req;
    let {
      query: { select },
    } = req;

    const filter = {
      owner: user._id,
      deleted_at: {
        $exists: false,
      },
    };

    if (pair) {
      filter.pair_symbol = pair;
    }
    if (type) {
      filter.direction = type;
    }
    if (owner_type) {
      filter.owner_type = owner_type;
    }

    const total_count = await Transaction.countDocuments({ ...filter, 
      kind: {
        $in: [
          TRANSACTION_KIND.MANUAL_DEPOSIT,
          TRANSACTION_KIND.MANUAL_WITHDRAW,
        ],
      },
      }),
      toIncludeBefore = [],
      toExcludeAfter = [],
      toSkip = pageToSkip(page, limit),
      toLimit = limit,
      page_count = +Math.ceil(total_count / limit),
      meta = {
        page,
        limit,
        page_count,
        total_count,
      };

    let manual_transactions = [];

    let query = Transaction.find({ ...filter, 
      kind: {
        $in: [
          TRANSACTION_KIND.MANUAL_DEPOSIT,
          TRANSACTION_KIND.MANUAL_WITHDRAW,
        ],
      },
    })
      .select(union(select, toIncludeBefore))
      .skip(toSkip)
      .limit(toLimit);

    manual_transactions = await query;
    manual_transactions = manual_transactions.map((tranasction) =>
      omit(tranasction.toJSON(), difference(toExcludeAfter, select))
    );

    res.json({
      manual_transactions,
      meta,
    });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/manual-transactions:
 *   get:
 *     tags:
 *       - Manual Transactions
 *     description: List all of the Manual Transactions ( deposit/withdraw )
 *     security:
 *       - OpenID Connect:
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Manual Transactions listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - manual_transactions
 *                 - meta
 *               properties:
 *                 manual_transactions:
 *                   type: array
 *                   items:
 *                     anyOf:
 *                       - $ref: "#/definitions/ManualDepositTransaction"
 *                       - $ref: "#/definitions/ManualWithdrawTransaction"
 *                 meta:
 *                   $ref: "#/definitions/Meta"
 *       401:
 *         $ref: "#/responses/401"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */
