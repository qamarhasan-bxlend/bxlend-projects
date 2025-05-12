"use strict";

const { Joi } = require("@src/lib");
const bodyParser = require("body-parser");
const { validate } = require("@src/middlewares");
const {
  DepositTransaction,
  Wallet,
  WithdrawTransaction,
  User,
} = require("@src/models");
const { NotFound } = require("@src/errors");
const {
  ERROR,
  TRANSACTION_KIND,
  TRANSACTION_STATUS,
  STATUS_CODE,CRYPTO_TYPE,
} = require("@src/constants");
const { BigNumber } = require("@src/lib");
const { DBTransaction } = require("@src/utils");
const { Mailgun } = require('@src/lib');

// ------------------------- Controller -------------------------
const CONTROLLER = [
  bodyParser.json(),
  validate({
    body: Joi.object().keys({
      apiVersion: Joi.string(),
      referenceId: Joi.string(),
      idempotencyKey: Joi.string(),
      data: Joi.object().keys({
        product: Joi.string(),
        event: Joi.string(),
        item: Joi.object().keys({
          blockchain: Joi.string(),
          network: Joi.string(),
          address: Joi.string(),
          minedInBlock: Joi.object().keys({
            height: Joi.number(),
            hash: Joi.string(),
            timestamp: Joi.number(),
          }),
          transactionId: Joi.string(),
          tokenType: Joi.string(),
          token: Joi.object().keys({
            amount: Joi.string(),
            contractAddress: Joi.string(),
            name: Joi.string(),
            symbol: Joi.string(),
          }),
          direction: Joi.string(),
        }),
      }),
    }),
  }),
  async function tokenConfirmedTransactionV1Controller(req, res) {
    const { body } = req;
    console.log(body);
    const direction = body.data.item.direction
    const transaction = await DBTransaction.init();
    try {
      let created_at;
      let cryptoAddress = body.data.item.address;

      // Find the wallet using the crypto address
      const foundWallet = await Wallet.findOne({
        address: cryptoAddress,
      }).session(transaction.mongoose().session);

      if (!foundWallet) {
        throw new NotFound(ERROR.WALLET_NOT_FOUND);
      }

      if (direction == "outgoing") {
        // Handle outgoing transaction
        const withdraw_transaction = await WithdrawTransaction.findOneAndUpdate(
          { crypto_api_transaction_request_id: body.referenceId },
          { status: TRANSACTION_STATUS.SUCCESS },
          { session: transaction.mongoose().session }
        );

        if (!withdraw_transaction) {
          return res
            .status(STATUS_CODE.NOT_FOUND)
            .json({ error: "Withdraw transaction not found" });
        }
        created_at = withdraw_transaction.created_at
      } else if (direction == "incoming") {
        // Handle incoming transaction
        const deposit_transaction = await DepositTransaction.create(
          [
            {
              owner: foundWallet.owner,
              kind: TRANSACTION_KIND.DEPOSIT,
              status: TRANSACTION_STATUS.SUCCESS,
              currency_code: body.data.item.token.symbol,
              quantity: body.data.item.token.amount,
              to: foundWallet._id, // not sure about this
            },
          ],
          { session: transaction.mongoose().session }
        );

        if (!deposit_transaction) {
          return res
            .status(STATUS_CODE.NOT_FOUND)
            .json({ error: "Could not create Deposit Transaction" });
        }
        // Update Local user wallet with new deposit
        foundWallet.available_balance = new BigNumber(
          foundWallet.available_balance
        )
          .plus(body.data.item.token.amount)
          .toFixed();
        await foundWallet.save({ session: transaction.mongoose().session });
        created_at = deposit_transaction[0].created_at
      }

      const user = await User.findOne({_id : foundWallet.owner})

      await transaction.commit();
      const variables = {
        id : body.referenceId,
        name : body.data.item.blockchain,
        symbol : body.data.item.token.symbol,
        amount : body.data.item.token.amount,
        status : TRANSACTION_STATUS.SUCCESS,
        fee : '0', //un-decided
        created_at : `${created_at}`,
        type : "Token",
        direction : direction == "incoming" ? "Deposit" : "Withdraw",
      }
      await Mailgun.sendTransactionConfirmationEmail(user, variables)

      // Respond to the request
      res.json({ message: `${direction} token transaction confirmed.` });
    } catch (error) {
      console.error("Error in transaction:", error);

      // If an error occurs, abort the transaction
      if (transaction) {
        await transaction.abort();
        console.log("Transaction aborted.");
      }

      // Handle the error and respond to the request with a specific error message
      if (error instanceof NotFound) {
        res.status(STATUS_CODE.NOT_FOUND).json({ error: error.message });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: "Internal server error",
        });
      }
      transaction.endSession();
    }
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// Expected body:
//   {
//     "apiVersion": "2021-03-20",
//     "referenceId": "6038d09050653d1f0e40584c",
//     "idempotencyKey": "e55bf7a4a7188855f1c27541a6c387d04cc3b22ee34d1304b0e6ecad61c9906c",
//     "data": {
//         "product": "BLOCKCHAIN_EVENTS",
//         "event": "ADDRESS_COINS_TRANSACTION_CONFIRMED",
//         "item": {
//             "blockchain": "bitcoin",
//             "network": "testnet",
//             "address": "bc1qmjhy4exylset37e6sfjdtfksm8kpcrxknj7cag",
//             "minedInBlock": {
//                 "height": 667861,
//                 "hash": "b00d27cccd5e4f4fa1b28824d9a1e5fef88e6c37cdeb09e37eb39aa1d3d63448",
//                 "timestamp": 1610365213
//             },
//             "transactionId": "b00d27cccd5e4f4fa1b28824d9a1e5fef88e6c37cdeb09e37eb39aa1d3d63448",
//             "amount": "0.0315",
//             "unit": "BTC",
//             "direction": "incoming"
//         }
//     }
// }

// TODO: Send notification to the front-end using websockets
// TODO: Send Email to the users

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/countries:
 *   get:
 *     tags:
 *       - Country
 *     description: Get countries
 *     security:
 *       - OpenID Connect:
 *     parameters:
 *       - $ref: "#/parameters/page_query"
 *       - description: "Pagination limit parameter (`0` means no limit)"
 *         in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 0
 *           default: 10
 *           example: 25
 *       - description: "Select parameter"
 *         in: query
 *         name: select
 *         schema:
 *           type: string
 *           enum:
 *             - id
 *             - code
 *             - name
 *             - phone_code
 *             - language
 *             - currency
 *             - created_at
 *             - updated_at
 *           default: []
 *           example:
 *             - code
 *             - name
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: The requested countries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - countries
 *                 - meta
 *               properties:
 *                 countries:
 *                   type: array
 *                   items:
 *                     $ref: "#/definitions/Country"
 *                 meta:
 *                   $ref: "#/definitions/Meta"
 *       400:
 *         $ref: "#/responses/400"
 *       401:
 *         $ref: "#/responses/401"
 *       500:
 *         $ref: "#/responses/500"
 */
