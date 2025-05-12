"use strict";

const { Joi } = require("@src/lib");
const bodyParser = require("body-parser");
const { validate } = require("@src/middlewares");
const { Wallet, DepositTransaction, WithdrawTransaction, User } = require("@src/models");
const { NotFound, WalletCurrencyUnsupported } = require("@src/errors");
const { STATUS_CODE, TRANSACTION_STATUS, VAULTODY_WEBHOOK_EVENTS } = require("@src/constants");

// Import event handlers
const {
  // incomingConfirmedCoinTransaction,
  // incomingConfirmedTokenTransaction,
  incomingMinedTransaction,
  transactionRequest,
  transactionApproved,
  transactionRejected,
  // outgoingFailed,
  outgoingMined,
  transactionBroadcasted,
} = require("@src/services/vaultody");

const CONTROLLER = [
  bodyParser.json(),
  validate({
    body: Joi.object().keys({
      walletId: Joi.string().required(),
      webhookId: Joi.string().required(),
      idempotencyKey: Joi.string().required(),
      apiVersion: Joi.string().required(),
      data: Joi.object().keys({
        event: Joi.string().valid(...VAULTODY_WEBHOOK_EVENTS).required(),
        item: Joi.object().required() // Additional validation will happen in respective handlers
      }).required(),
    }),
  }),
  async function vaultodyTransactionStatusUpdateV1Controller(req, res) {
    const { walletId, webhookId, idempotencyKey, apiVersion, data } = req.body;
    // validate secret Key too
    // Switch based on event type
    try {
      switch (data.event) {
        // NOTE: Flow of incoming transactions
        // - on first confirmation, we recieve INCOMING_MINED_TX
        // - we keep receiveing INCOMING_CONFIRMED_COIN_TX or INCOMING_CONFIRMED_TOKEN_TX until 12 confirmations
        case 'INCOMING_CONFIRMED_COIN_TX':
          // await incomingConfirmedCoinTransaction(data);
          console.log(data);
          break;

        case 'INCOMING_CONFIRMED_TOKEN_TX':
          // await incomingConfirmedTokenTransaction(data);
          console.log(data);
          break;

        case 'INCOMING_MINED_TX':
          await incomingMinedTransaction(data);

          break;

        case 'TRANSACTION_REQUEST':
          await transactionRequest(data);

          break;

        case 'TRANSACTION_APPROVED':
          await transactionApproved(data);

          break;

        case 'TRANSACTION_REJECTED':
          await transactionRejected(data);

          break;

        case 'OUTGOING_FAILED':
          // await outgoingFailed(data);
          console.log(data);
          break;

        case 'OUTGOING_MINED':
          await outgoingMined(data);

          break;

        case 'TRANSACTION_BROADCASTED':
          await transactionBroadcasted(data);
          break;

        default:
          throw new WalletCurrencyUnsupported('Event not supported.');
      }

      res.status(STATUS_CODE.OK).json({ message: 'Event processed successfully' });
    } catch (err) {
      console.error(err);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Failed to process the event' });
    }
  }
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

// module.exports = CONTROLLER;

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
