"use strict";

const { Joi } = require("@src/lib");
const bodyParser = require("body-parser");
const { validate } = require("@src/middlewares");
const {
  DepositTransaction,
  Wallet,
  WithdrawTransaction,
  User
} = require("@src/models");
const { NotFound } = require("@src/errors");
const {
  ERROR,
  TRANSACTION_KIND,
  TRANSACTION_STATUS,
  STATUS_CODE,CRYPTO_TYPE,
  CRYPTO_TRANSACTION_REQUEST_STATUS
} = require("@src/constants");
const { BigNumber } = require("@src/lib");
const { DBTransaction } = require("@src/utils");
const { Mailgun,CryptoApis } = require('@src/lib');
const { Notification } = require('@src/models');

// ------------------------- Controller -------------------------
const CONTROLLER = [
  bodyParser.json(),
  // cryptoapisCallbackSecurityMiddleware, TODO
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
          requiredApprovals: Joi.number(),
          requiredRejections: Joi.number(),
          currentApprovals: Joi.number(),
          currentRejections: Joi.number(),
          transactionId: Joi.string(),
        }),
      }),
    }),
  }),
  async function callbackCoinTransactionRequestV1Controller(req, res) {
    try {
    const { body} = req;
    // change it after testing and  amke it a notification for user only
    const event = body.data.event;
    const noti = await Notification.create({
      user : '66a62d3c614cbf3998cd3510',
      title : "Callback "+event,
      message : 'Webhook for transaction request got hit with body'+ JSON.stringify(body)
    })

    const transaction = await WithdrawTransaction.findOne({
      crypto_api_transaction_request_id: body.referenceId,
      status: TRANSACTION_STATUS.PENDING,
    });

    if (!transaction) {
      throw new NotFound(ERROR.TRANSACTION_NOT_FOUND);
    }

    if (event == CRYPTO_TRANSACTION_REQUEST_STATUS.REJECTED || event == CRYPTO_TRANSACTION_REQUEST_STATUS.FAILED) {
      transaction.status = TRANSACTION_STATUS.FAILED;
      await transaction.save();
      // TODO: Update user's wallet with refunded amount
    }
    else if (event == CRYPTO_TRANSACTION_REQUEST_STATUS.BROADCASTED) {
      transaction.crypto_transaction_id = body.data.item.transactionId;
      await transaction.save();
    }
    else if (event == CRYPTO_TRANSACTION_REQUEST_STATUS.MINED) {
      const cryptoTransactionId = body.data.item.transactionId
      const blockchain = body.data.item.blockchain
      const network = body.data.item.network
      console.log(cryptoTransactionId, blockchain, network)

      const confirmationData = await CryptoApis.getTransactionConfirmation(blockchain, network, cryptoTransactionId)
      console.log(confirmationData)
      if(confirmationData.data.item.isConfirmed){
          try {
            transaction.status = TRANSACTION_STATUS.SUCCESS;
            transaction.crypto_transaction_id = cryptoTransactionId;
            await transaction.save();
          } catch (error) {
              // TODO: Handle proper error here
          }
      }
    }
    res.json({ message: "Got hit successfully" })
    }
    catch(error){
      res.json({ message: error });
      console.log("Error updating withdrawal transaction records:", error.error.details);
    }
    
    // TODO
    // - Check if transaction is failed or rejected https://developers.cryptoapis.io/v-1.2023-04-25-105/RESTapis/transactions/create-coins-transaction-request-from-wallet/post#TRANSACTION_REQUEST_BROADCASTED-post-callback
    // - return the amount to users wallet
    // - check if transaction is broadcasted
    // - Update the transaction information with transaction ID provided in case of broadcasted

    return;

    let created_at;
    console.log('body\n')
    console.log(body) 
    try {
      // if(!noti){
      //   throw error('Could not create notification')
      // }  
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
              currency_code: body.data.item.unit,
              quantity: body.data.item.amount,
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
          .plus(body.data.item.amount)
          .toFixed();
        await foundWallet.save({ session: transaction.mongoose().session });
        created_at = deposit_transaction[0].created_at
      }

      const user = await User.findOne({_id : foundWallet.owner})

      // Commit the transaction
      await transaction.commit();
      const variables = {
        id : body.referenceId,
        name : body.data.item.blockchain,
        symbol : body.data.item.unit,
        amount : body.data.item.amount,
        status : TRANSACTION_STATUS.SUCCESS,
        fee : '0', //un-decided
        created_at : `${created_at}`,
        type : "Coin",
        direction : direction == "incoming" ? "Deposit" : "Withdraw",
      }
      await Mailgun.sendTransactionConfirmationEmail(user, variables)
      // const list = await CryptoApis.getBlockChainEventSubscriptions()
      // console.log(list.data.items)

      // Respond to the request
      res.json({ message: `${direction} coin transaction confirmed.` });
    } catch (error) {
      console.error("Error in transaction:", error.message);

      // If an error occurs, abort the transaction
      if (transaction) {
        await transaction.abort();
        console.log("Transaction aborted.");
      }

      // Handle the error and respond to the request with a specific error message
      if (error instanceof NotFound) {
        res.status(STATUS_CODE.NOT_FOUND).json({ error: error });
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
