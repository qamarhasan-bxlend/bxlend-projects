"use strict";

const { Joi } = require("@src/lib");
const bodyParser = require("body-parser");
const { validate } = require("@src/middlewares");
const {
    DepositTransaction,
    Wallet,
    WithdrawTransaction,
    User,
    Currency,
    Blockchain
} = require("@src/models");
const { NotFound } = require("@src/errors");
const {
    ERROR,
    TRANSACTION_KIND,
    TRANSACTION_STATUS,
    STATUS_CODE, CRYPTO_TYPE,
} = require("@src/constants");
const { BigNumber } = require("@src/lib");
const { DBTransaction } = require("@src/utils");
const { Mailgun, CryptoApis } = require('@src/lib');
const { Notification } = require('@src/models');

// ------------------------- Controller -------------------------


// expected body:
// "data": {
//     "event": "INCOMING_MINED_TX",
//     "item": {
//       "blockchain": "tron",
//       "network": "nile",
//       "address": "TDGFc6pDe5q2gc9zi4p2JQHfJTXVTBw7yu",
//       "minedInBlock": {
//         "height": 45323934,
//         "hash": "0000000002b3969e82281bb3b6d96e88e416d422faaae27a05b8522bc30c83fc",
//         "timestamp": 1710924012
//       },
//       "direction": "incoming",
//       "currentConfirmations": 1,
//       "targetConfirmations": 12,
//       "transactionId": "a6f8225d5a905fc236e5d85d88f77d127d48e80bb456042853c8ed6210182f4f",
//       
//       // in case of coin
//       "amount": '0.1',
//       "unit": 'BNB',
//       
//       // in case of token
//       "tokenType": "TRC-20",
//       "token": { 
//         "amount": "50000",
//         "contractAddress": "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj",
//         "symbol": "USDT",
//         "name": "Tether USD",
//         "decimals": 6
//       }
//     }
//   }
// 

// Algorithm
// Validate body especially if event is INCOMING_MINED_TX
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
// send email regarding incoming deposit

async function incomingMinedTransaction(data) {
    if (data.event !== "INCOMING_MINED_TX") throw new Error("Invalid event type");

    const transaction = await DBTransaction.init();
    try {
        const { blockchain, address, transactionId, unit, amount, token } = data.item;
        const direction = data.item.direction;
        const title = 'Coin Deposit';
        const isToken = !!token?.name;
        const query = {
            code: isToken ? token.symbol : unit,
            crypto_type: isToken ? 'token' : 'coin'
        };

        // Check if currency and blockchain are supported
        const currency = await Currency.findOne(query).populate('supported_blockchains.blockchain');
        if (!currency) throw new NotFound('Unit currency not found');

        const isBlockchainValid = validateBlockchain(currency, blockchain, token, isToken);
        if (!isBlockchainValid) throw new Error(isToken ? 'Unsupported token contract address for the blockchain' : 'Unsupported blockchain for coin unit');

        // Find wallet by address
        const foundWallet = await Wallet.findOne({ address }).session(transaction.mongoose().session);
        if (!foundWallet) throw new NotFound(ERROR.WALLET_NOT_FOUND);

        // Check for existing transaction
        const existingTransaction = await DepositTransaction.findOne({
            crypto_transaction_id: transactionId,
            to: foundWallet._id,
        }).session(transaction.mongoose().session);

        if (existingTransaction) {
            if (existingTransaction.status === TRANSACTION_STATUS.SUCCESS && existingTransaction.quantity !== amount) {
                throw new Error("Transaction amount mismatch for confirmed transaction");
            }
            return;
        }

        // Create new deposit transaction
        const depositTransaction = await DepositTransaction.create([{
            kind: TRANSACTION_KIND.DEPOSIT,
            status: TRANSACTION_STATUS.SUCCESS,
            currency_code: unit,
            quantity: amount,
            crypto_transaction_id: transactionId,
            to: foundWallet._id,
        }], { session: transaction.mongoose().session });

        if (!depositTransaction) throw new Error("Could not create deposit transaction");

        // Update wallet balance
        await updateWalletBalance(foundWallet, token, amount, isToken, transaction);

        // Send notification and email
        await createNotification(foundWallet.owner, title, amount, unit, token);
        await sendTransactionEmail(foundWallet.owner, transactionId, blockchain, unit, amount, depositTransaction[0].created_at, isToken);

        await transaction.commit();
        return { message: `${direction} coin transaction confirmed.` };
    } catch (error) {
        console.log(error.message)
        if (transaction) await handleTransactionError(transaction, error);
        throw error;
    }
}

// ------------------------- Helper Functions ----------------------------

function validateBlockchain(currency, blockchain, token, isToken) {
    return currency.supported_blockchains.some(bc => (
        bc.blockchain.vaultody_name === blockchain &&
        (!isToken || bc.contract_address === token.contractAddress)
    ));
}

async function updateWalletBalance(foundWallet, token, amount, isToken, transaction) {
    if (isToken) {
        const tokenWallet = await Wallet.findOne({
            owner: foundWallet.owner,
            currency_code: token.symbol
        }).session(transaction.mongoose().session);

        tokenWallet.available_balance = new BigNumber(tokenWallet.available_balance).plus(token.amount).toFixed();
        await tokenWallet.save({ session: transaction.mongoose().session });
    } else {
        foundWallet.available_balance = new BigNumber(foundWallet.available_balance).plus(amount).toFixed();
        await foundWallet.save({ session: transaction.mongoose().session });
    }
}

async function createNotification(userId, title, amount, unit, token) {
    await Notification.create({
        user: userId,
        title,
        message: `Deposit of ${amount ?? token.amount} ${unit ?? token.symbol} received successfully.`
    });
}

async function sendTransactionEmail(userId, transactionId, blockchain, unit, amount, createdAt, isToken) {
    const user = await User.findById(userId);
    const emailVariables = {
        id: transactionId,
        name: blockchain,
        symbol: unit,
        amount,
        status: TRANSACTION_STATUS.SUCCESS,
        fee: '0',
        created_at: createdAt,
        type: isToken ? "Token" : "Coin",
        direction: "Deposit",
    };
    await Mailgun.sendTransactionConfirmationEmail(user, emailVariables).catch((err) => {
        console.log(err)
    });
}

async function handleTransactionError(transaction, error) {
    if (transaction) {
        await transaction.abort();
        console.log("Transaction aborted.");
    }
}

// ------------------------- Exports ----------------------------

module.exports = incomingMinedTransaction;

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
