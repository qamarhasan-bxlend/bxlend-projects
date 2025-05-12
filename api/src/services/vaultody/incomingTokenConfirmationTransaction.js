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
} = require("@src/constants");
const { BigNumber } = require("@src/lib");
const { DBTransaction } = require("@src/utils");
const { Mailgun,CryptoApis } = require('@src/lib');
const { Notification } = require('@src/models');

// ------------------------- Controller -------------------------
// const CONTROLLER = [
//   validate({
//     body: Joi.object().keys({
//       walletId: Joi.string(),
//       webhookId: Joi.string(),
//       apiVersion: Joi.string(),
//       referenceId: Joi.string(),
//       idempotencyKey: Joi.string(),
//       data: Joi.object().keys({
//         product: Joi.string(),
//         event: Joi.string(),
//         item: Joi.object().keys({
//           blockchain: Joi.string(),
//           network: Joi.string(),
//           address: Joi.string(),
//           minedInBlock: Joi.object().keys({
//             height: Joi.number(),
//             hash: Joi.string(),
//             timestamp: Joi.number(),
//           }),
//           currentConfirmations: Joi.number(),
//           targetConfirmations: Joi.number(),
//           transactionId: Joi.string(),
//           amount: Joi.string(),
//           unit: Joi.string(),
//           // direction: Joi.string(),
//         }),
//       }),
//     }),
//   }),

// expected body:

  // "data": {
  //   "event": "INCOMING_CONFIRMED_TOKEN_TX",
  //   "item": {
  //     "blockchain": "tron",
  //     "network": "nile",
  //     "address": "TDGFc6pDe5q2gc9zi4p2JQHfJTXVTBw7yu",
  //     "minedInBlock": {
  //       "height": 45323934,
  //       "hash": "0000000002b3969e82281bb3b6d96e88e416d422faaae27a05b8522bc30c83fc",
  //       "timestamp": 1710924012
  //     },
  //     "currentConfirmations": 4,
  //     "targetConfirmations": 12,
  //     "tokenType": "TRC-20",
  //     "transactionId": "a6f8225d5a905fc236e5d85d88f77d127d48e80bb456042853c8ed6210182f4f",
  //     "token": {
  //       "tokenName": "Tether USD",
  //       "tokenSymbol": "USDT",
  //       "decimals": 6,
  //       "tokensAmount": "50000",
  //       "contract": "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"
  //     }
  //   }
  // }


  async function incomingTokenConfirmationTransaction(data) {
    // Algorithm (not the correct one)
    // Validate body
    // find wallet in database using receiver address
    // search if transaction with same transactionID and same address already exists.
    // if it already exists and status is confirmed instead of mined, dont touch it. just compare the amount and generate error if amount is not same 
    // if it doesnt exist, next()
    // in case of token, 
    //                  -confirm if contract address of token is present in supported blockchains of currency
    //                  -contract address matches
    // create deposit_transaction
    // update users wallet balance
    //                            - in case of token, update token's wallet balance
    //                            - in case of coin, update native currency's wallet balance
    // create notification
    // send email regarding incoming deposit 

    return;
    const { body} = req;
    // change it after testing 
    const direction = "incoming";
    const title = 'Coin Deposit';
    if(req.body.data.event == "INCOMING_MINED_TX"){
      console.log("mined event")
      console.log(req.body);
      console.log(req.body.data.item.minedInBlock)
      console.log(req.body.data.item.token)
    }
    
    
    
    return 
    // const noti = await Notification.create({
    //   user : '66a62d3c614cbf3998cd3510',
    //   title : title,
    //   message : 'Webhook got hit '+ JSON.stringify(body)
    // })

    let created_at;
    console.log('body\n')
    console.log(body) 
    const transaction = await DBTransaction.init();
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
          { crypto_transaction_id: body.data.item.transactionId },
          { status: TRANSACTION_STATUS.SUCCESS },
          { session: transaction.mongoose().session }
        );

        if (!withdraw_transaction) {
          console.log("Transaction not found from webhook, ", body);
          return res.json({ error: "Withdraw transaction not found" });
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
              crypto_transaction_id: body.data.item.transactionId,
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
        console.log("Webhook got hit with Not found error");
        res.json({ message: error }); // Note: not sending the code for errors as this will deactivate the subscription
        // res.status(STATUS_CODE.NOT_FOUND).json({ error: error });
      } else {
        console.log("Webhook got hit with Internal server error");
        res.json({ message: "Internal server error" }); // Note: not sending the code for errors as this will deactivate the subscription
        // res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        //   error: "Internal server error",
        // });
      }

      transaction.endSession();
    }
  }
// ,];

// ------------------------- Exports ----------------------------

module.exports = incomingTokenConfirmationTransaction;

// TODO: Send notification to the front-end using websockets
// TODO: Send Email to the users

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
