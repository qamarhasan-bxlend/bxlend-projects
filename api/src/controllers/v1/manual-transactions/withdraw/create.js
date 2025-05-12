"use strict";

const validate = require("@root/src/middlewares/validator");
const {
  ManualWithdrawTransaction,
  Wallet,
  InternalWallet,
  BankAccount,
  Country,
  Currency,
} = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const {
  TRANSACTION_STATUS,
  STATUS_CODE,
  TRANSACTION_KIND,
  ERROR,
  BANK_ACCOUNT_STATUS,
} = require("@src/constants");
const { BigNumber } = require("@src/lib");
const bodyParser = require("body-parser");
const { DBTransaction } = require("@src/utils");

// ------------------------- Controller -------------------------

// TODOs
// 1) (/admin/manual-withdrawals/:id)
// an admin interface or endpoint where an admin can view and manage pending manual withdrawal requests.
// 2) input bank detail into Bank-Accounts Model, but first bank-account models need to be modified

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    body: Joi.object()
      .keys({
        description: Joi.string().default(null),
        currency_code: Joi.string().required(),
        quantity: Joi.string().required(),
        bank_details: Joi.object()
          .keys({
            bank_name: Joi.string().required(), // Bank Name
            bank_country: Joi.string().required(), // Bank located country ID
            account_number: Joi.string().required(), // Bank Account number
            swift_bic_code: Joi.string().required(),
          })
          .optional(),
      })
      .required(),
    query: Joi.object().keys({
      select: Joi.array()
        .items(
          Joi.string().valid(...ManualWithdrawTransaction.getSelectableFields())
        )
        .default([]),
    }),
  }),
  async function createManualWithdrawTransactionV1Controller(req, res) {
    const {
      user,
      query: { select },
      body,
    } = req;
    const { currency_code, quantity, bank_details } = body;
    const transaction = await DBTransaction.init();
    try {

      const currencyData = await Currency.findOne({
        code: currency_code,
      });
      if (!currencyData) throw new Error(ERROR.CURRENCY_NOT_FOUND);

      const userWallet = await Wallet.findOne({
        owner: user._id,
        currency_code,
      }).session(transaction.mongoose().session);

      if(!userWallet){
        throw new Error(ERROR.USER_NOT_FOUND)
      }
      const availableBalance = new BigNumber(userWallet.available_balance);
      const withdrawalAmount = new BigNumber(quantity);

      if (availableBalance.isLessThan(withdrawalAmount)) {
        throw new Error(ERROR.INSUFFICIENT_FUNDS)
      }

      const currentDate = Date.now();
      let expirationDate;
      if (bank_details) {
        expirationDate = currentDate + 30 * 60 * 1000;

        const countryData = await Country.findOne({
          name: bank_details.bank_country,
        });

        if (!countryData) {
          throw new Error(ERROR.COUNTRY_NOT_FOUND);
        }
        // console.log(countryData);

        const createBankAccount = await BankAccount.create(
          [
            {
              owner: user._id,
              bank_name: bank_details.bank_name,
              bank_country: countryData._id,
              account_number: bank_details.account_number,
              swift_bic_code: bank_details.swift_bic_code,
              currency: currencyData._id,
              status: BANK_ACCOUNT_STATUS.UNDER_REVIEW,
              ...body,
            },
          ],
          { session: transaction.mongoose().session }
        );

        if (!createBankAccount)
          throw new Error("Bank account could not be created");
      } else {
        expirationDate = currentDate + 24 * 60 * 60 * 1000;
      }

      const internalWallet = await InternalWallet.findOne({
        currency_code,
      });
      if (!internalWallet) {
        throw new Error(
          "Internal Wallet with this currency-code does not exist."
        );
      }

      // Create a manual withdrawal transaction
      const withdrawal_transaction = await ManualWithdrawTransaction.create(
        [
          {
            owner: user._id,
            status: TRANSACTION_STATUS.PENDING,
            kind: TRANSACTION_KIND.MANUAL_WITHDRAW,
            from: userWallet._id,
            to: internalWallet._id, //TODO : correct this implementation
            withdrawal_expiration: expirationDate,
            ...body,
          },
        ],
        { session: transaction.mongoose().session }
      );
      if (!withdrawal_transaction) {
        throw new Error("Transaction could not be created");
      }

      userWallet.available_balance = new BigNumber(userWallet.available_balance)
        .minus(quantity)
        .toFixed();

      await userWallet.save({ session: transaction.mongoose().session });
      await transaction.commit();

      res
        .status(STATUS_CODE.OK)
        .json({ manual_withdraw_transaction: withdrawal_transaction });
    } catch (error) {
      console.error("Error in transaction:", error);
      

      // If an error occurs, abort the transaction
      if (transaction) {
        await transaction.abort();
        console.log("Transaction aborted.");
      }

      // Handle the error and respond to the request
      res.status(500).json({ error: error.message });
    }
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/manual-transactions/withdraw:
 *   post:
 *     tags:
 *       - Manual Transactions
 *     description: Create a Manual Withdraw Transaction
 *     security:
 *       - OpenID Connect:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - currency_code
 *               - quantity
 *               - from
 *               - to
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               currency_code:
 *                 type: string
 *               quantity:
 *                 type: string
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Manual Withdraw Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - manual_transaction
 *               properties:
 *                 manual_transaction:
 *                   $ref: "#/definitions/ManualWithdrawTransaction"
 *       401:
 *         $ref: "#/responses/401"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */
