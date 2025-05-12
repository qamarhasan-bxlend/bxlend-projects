"use strict";

exports.Setting = require("./Setting");

exports.User = require("./User");
exports.WaitingListUser = require('./WaitingListUser')
exports.ResetPassword = require('./ResetPassword')
exports.Notification = require('./Notification')

exports.OAuthGrant = require("./OAuthGrant");
exports.OAuthInteraction = require("./OAuthInteraction");
exports.OAuthSession = require("./OAuthSession");
exports.Client = require("./Client");
exports.Token = require("./Token");

exports.Country = require("./Country");

exports.Currency = require("./Currency");
exports.CryptoCurrency = require("./CryptoCurrency");
exports.FiatCurrency = require("./FiatCurrency");

exports.Blockchain = require("./Blockchain");

exports.CurrencyPair = require("./CurrencyPair");

exports.Verification = require("./Verification");
exports.EmailVerification = require("./EmailVerification");
exports.PhoneNumberVerification = require("./PhoneNumberVerification");
exports.WaitingListUsersVerification = require('./WaitingListUserVerification')

exports.Wallet = require("./Wallet");
exports.FiatWallet = require("./FiatWallet");
exports.CryptoWallet = require("./CryptoWallet");
exports.InternalWallet = require("./InternalWallet");

exports.Ticker = require("./Ticker");

exports.Order = require("./Order");
exports.MarketOrder = require("./MarketOrder");
exports.LimitOrder = require("./LimitOrder");
exports.StopLimitOrder = require("./StopLimitOrder");
exports.MarketTrades = require('./MarketTrades')

exports.Transaction = require("./Transaction");
exports.TransactionFee = require("./TransactionFee")
exports.DepositTransaction = require("./DepositTransaction");
exports.TransferTransaction = require("./TransferTransaction");
exports.WithdrawTransaction = require("./WithdrawTransaction");
exports.ManualWithdrawTransaction = require("./ManualWithdrawTransaction");
exports.ManualDepositTransaction = require("./ManualDepositTransaction");

exports.BankAccount = require("./BankAccount");
exports.AdminSetting = require("./AdminSetting");

exports.Kyc = require("./Kyc");
exports.PresaleUser = require("./PresaleUser");
exports.PresaleTokenSetup = require("./PresaleTokenSetup");
exports.PresaleTransaction = require("./PresaleTransaction");



// ------------------------- Swagger -------------------------

/**
 * @swagger
 *
 * definitions:
 *   DBDocument:
 *     type: object
 *     required:
 *       - id
 *       - created_at
 *       - updated_at
 *     properties:
 *       id:
 *         description: "The document identifier"
 *         type: string
 *         readOnly: true
 *         format: ObjectId
 *         example: "a1b2c3d"
 *       created_at:
 *         description: "Document's creation date-time"
 *         type: string
 *         readOnly: true
 *         format: date-time
 *         example: "2017-07-21T17:32:28Z"
 *       updated_at:
 *         description: "Document's last update date-time"
 *         type: string
 *         readOnly: true
 *         format: date-time
 *         example: "2017-07-21T17:32:28Z"
 *
 */
