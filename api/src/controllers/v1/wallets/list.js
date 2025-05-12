"use strict";

const { WALLET_OWNER, COLLECTION } = require("@src/constants");
const { Joi } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const { Wallet, Currency } = require("@src/models");
const { pageToSkip } = require("@src/utils");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  validate({
    query: Joi
      .object()
      .keys({
        page: Joi
          .number()
          .integer()
          .min(1)
          .default(1),
        limit: Joi
          .number()
          .integer()
          .min(1),
      }),
  }),
  async function listWalletsV1Controller(req, res) {
    const { user, query: { page, limit } } = req;

    const skip = pageToSkip(page, limit);
    let wallets = [];
    let page_count = 0;

    const owner_type = WALLET_OWNER.USER; // TODO:
    const owner = user._id; // TODO:

    const walletFilters = {
      owner_type,
      owner,
      deleted_at: { $exists: false },
    };

    const [total_count, existing_wallets] = await Promise.all([
      Currency.countDocuments(),
      Wallet
        .find(walletFilters)
        .lean()
        .select("-_id currency_code"),
    ]);

    const wallet_count = existing_wallets.length;

    const virtual_count = total_count - wallet_count;

    const remaining_count = limit - Math.max(wallet_count - skip, 0);

    const currency_count = Math.min(remaining_count, virtual_count);

    const currencyPipeline = [
      {
        $match: {
          code: { $nin: existing_wallets.map(wallet => wallet.currency_code) },
          deleted_at: { $exists: false },
        },
      },
      { $sort: { code: 1 } }, // TODO: currency sort
      { $limit: currency_count },
      {
        $set: {
          owner_type,
          owner,
          balance: "0",
        },
      },
      {
        $project: { // TODO:
          _id: false,
          kind: true,
          owner_type: true,
          owner: true,
          currency: "$code",
          balance: true,
        },
      },
    ];

    if (total_count > skip) {
      const pipeline = [];

      if (wallet_count > skip) {
        pipeline.push(
          { $match: walletFilters },
          { $sort: { balance: -1 } },
        );

        if (skip > 0) pipeline.push({ $skip: skip });

        if (limit > 0) pipeline.push({ $limit: limit });

        pipeline.push({
          $project: {
            _id: false,
            kind: true,
            owner_type: true,
            owner: true,
            currency: "$currency_code",
            balance: { $toString: "$available_balance" },
          },
        });

        if (remaining_count > 0 && virtual_count > 0) {
          pipeline.push({
            $unionWith: {
              coll: COLLECTION.CURRENCY,
              pipeline: currencyPipeline,
            },
          });
        }

        wallets = await Wallet.aggregate(pipeline);
      } else if (currency_count > 0) {
        wallets = await Currency.aggregate(currencyPipeline);
      }

      page_count = wallets.length;
    }

    res.json({
      wallets,
      meta: {
        page,
        limit,
        page_count,
        total_count,
      },
    });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/wallets:
 *   get:
 *     tags:
 *       - Wallet
 *     description: Get wallets
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/page_query"
 *       - $ref: "#/parameters/limit_query"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: The requested wallets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - wallets
 *                 - meta
 *               properties:
 *                 wallets:
 *                   type: array
 *                   items:
 *                     $ref: "#/definitions/Wallet"
 *                 meta:
 *                   $ref: "#/definitions/Meta"
 *       400:
 *         $ref: "#/responses/400"
 *       401:
 *         $ref: "#/responses/401"
 *       500:
 *         $ref: "#/responses/500"
 */
