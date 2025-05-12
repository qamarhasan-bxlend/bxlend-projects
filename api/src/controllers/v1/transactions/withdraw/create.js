"use strict";

const validate = require("@root/src/middlewares/validator");
const { Joi, CryptoApis, Vaultody } = require("@src/lib");
const { auth, verifyTwoFACode, kycAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const {
  ERROR,
  TRANSACTION_STATUS,
  STATUS_CODE,
  TRANSACTION_KIND,
  CRYPTO_WALLET_PLATFORM,
  KYC_STATUS,
  NETWORK_TYPE,
  ENV,
  PROTOCOL_TYPE
} = require("@src/constants");
const {
  WithdrawTransaction,
  CryptoWallet,
  InternalWallet, Notification,
  Currency,
  Blockchain
} = require("@src/models");
const { NODE_ENV } = require("@src/config");
const { NotFound } = require("@src/errors");
const { BigNumber } = require("@src/lib");
const { DBTransaction } = require("@src/utils");
const { WalletCurrencyUnsupported } = require("@src/errors");

// ------------------------- Controller -------------------------

// Updated Algorithm
// - Get supported withdrawals list from currency model. (TODO: update currency model with supported withdrawal blockchains)
// TODO task for supported withdrawals: add these properties to schema:
// "withdrawal_options": {
//     "is_allowed": false,
//     "is_suspended": false
//   },
// "deposit_options": {
//     "is_allowed": true,
//     "is_suspended": true
//   }
// - check if withdrawal is supported for mentioned currency on blockchain
// - check if withdrawal is suspended or not on mentioned blockchain for the required currency
// - if its token, (token will be identified by checking if user is trying to withdraw from native blockchain or not. Not from currency crypto_type)
//    - Create transaction using 'Create Fungible Tokens Transaction Request From Address' of vaultody
// - if its coin, (coin will be identified by checking if user is trying to withdraw from native blockchain or not. Not from currency crypto_type)
//    - Create transaction using 'Create Account Based Transaction Request from Address' of vaultody
// - Update users wallet balance
// NOTE: created transaction should have PENDING status
// create notification
// send email regarding outgoing Transaction

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  // verifyTwoFACode(),
  kycAuth(),
  validate({
    body: Joi.object()
      .keys({
        currency: Joi.string().objectId().required(), // objectId from now on, but first will let frontend dev know
        quantity: Joi.string().required(),
        recipient_address: Joi.string().required(),
        two_fa_code: Joi.string().required(),
        blockchain: Joi.string().objectId().required()
      })
      .required(),
  }),
  async function createWithdrawTransactionV1Controller(req, res) {
    const { user, body } = req;

    // Initialize a new transaction
    const transaction = await DBTransaction.init();

    try {
      const currency = await Currency.findOne({
        _id: body.currency,
        deleted_at: { $exists: false }
      })
      // .populate('supported_blockchains.blockchain')
      if (!currency) {
        throw new NotFound('currency not found or unsupported')
      }
      // find blockchain through symbol
      const withdrawingBlockchain = await Blockchain.findOne({
        _id: body.blockchain,
        deleted_at: { $exists: false }
      })

      if (!withdrawingBlockchain) {
        return res.status(409).send({ message: "unsupported blockchain" })
      }
      let isWithdrawalAllowed = false;
      let tokenIdentifier = currency.supported_blockchains.find(bc => {
        if (bc.blockchain == withdrawingBlockchain.id) {
          if (!bc.withdrawal_options.is_allowed || bc.withdrawal_options.is_suspended) {
            return res.status(409).json({ message: 'Withrawals not supported on this Network' })
          } else {
            return bc.contract_address;
          }
        }
      });
      let network;
      if (NODE_ENV === ENV.DEVELOPMENT) {
        // Choose a test network (first non-mainnet network)
        network = withdrawingBlockchain.networks.find(n => n.network_type === NETWORK_TYPE.TESTNET);
        if (!network) throw new WalletCurrencyUnsupported("Testnet network not available");
      } else if (NODE_ENV === ENV.PRODUCTION) {
        // Choose mainnet and lowercase the network_name
        network = withdrawingBlockchain.networks.find(n => n.network_type === NETWORK_TYPE.MAINNET);
        if (!network) throw new WalletCurrencyUnsupported("Mainnet Network not available");
      }
      network.network_name = network.network_name.toLowerCase();  // Ensure lowercase

      const userWallet = await CryptoWallet.findOne({
        currency_code: currency.code,
        owner: user._id,
        deleted_at: { $exists: false }
      }).session(transaction.mongoose().session);

      if (!userWallet) {
        throw new NotFound(ERROR.WALLET_NOT_FOUND);
      }

      // Subtract quantity from the available balance
      userWallet.available_balance = new BigNumber(userWallet.available_balance)
        .minus(body.quantity)
        .toFixed();

      const availableBalance = new BigNumber(userWallet.available_balance);
      if (availableBalance.isLessThan(0)) {
        res.status(400).json({ message: "Insufficient Wallet Balance" });
      };

      const internalWallet = await InternalWallet.findOne({
        platform: CRYPTO_WALLET_PLATFORM.VAULTODY,
        currency_code: currency.code,
      }).session(transaction.mongoose().session);
      if (!internalWallet || internalWallet.address == "unavailable")
        throw new WalletCurrencyUnsupported(
          "This Currency Withdrawal is Not supported by the Platform"
        );

      // TODO: Calculate Fees 
      // fetch the current fee of blockchain, TODO: add current_fee to blockchain model
      // convert the fee of blockchain to withdrawn currency according to market price
      // Update the quantity : new_quantity = quantity - fees
      let fee = 0;
      let updated_quantity = new BigNumber(body.quantity)
        .minus(fee)
        .toFixed();

      var transactionResponse;
      if (tokenIdentifier) {
        if (withdrawingBlockchain.protocol_type == PROTOCOL_TYPE.ACCOUNT_BASED && !withdrawingBlockchain.fee_priority_required) {
          transactionResponse = await Vaultody.createSingleTokenFeelessTransaction(
            withdrawingBlockchain.vaultody_name,
            network.network_name,
            internalWallet.address,
            updated_quantity, // only quantity or updated quantity
            body.recipient_address,
            tokenIdentifier
          );
        }
        else {
          transactionResponse = await Vaultody.createFungibleTokenTransactionRequest(
            withdrawingBlockchain.vaultody_name,
            network.network_name,
            internalWallet.address,
            updated_quantity,
            body.recipient_address,
            tokenIdentifier
          );
        }
      }
      else {
        if (withdrawingBlockchain.protocol_type == PROTOCOL_TYPE.ACCOUNT_BASED && !withdrawingBlockchain.fee_priority_required) {
          transactionResponse = await Vaultody.createSingleCoinFeelessTransaction(
            withdrawingBlockchain.vaultody_name,
            network.network_name,
            internalWallet.address,
            updated_quantity,
            body.recipient_address)
        }
        else if (withdrawingBlockchain.protocol_type == PROTOCOL_TYPE.ACCOUNT_BASED && withdrawingBlockchain.fee_priority_required) {
          transactionResponse = await Vaultody.createAccountBasedCoinTransaction(
            withdrawingBlockchain.vaultody_name,
            network.network_name,
            internalWallet.address,
            updated_quantity,
            body.recipient_address)
        }
        else if (withdrawingBlockchain.protocol_type == PROTOCOL_TYPE.UTXO_BASED && withdrawingBlockchain.fee_priority_required) {
          transactionResponse = await Vaultody.createUTXOBasedCoinTransaction(
            withdrawingBlockchain.vaultody_name,
            network.network_name,
            internalWallet.address,
            updated_quantity,
            body.recipient_address)
        }

      }
      console.log('transactionResponse', transactionResponse)

      // const cryptoTransaction = await Vaultody.
      if (!transactionResponse) {
        throw new Error("Transaction could not be created on Vaultody");
      }
      let withdraw_transaction = await WithdrawTransaction.create(
        [
          {
            owner: user._id,
            kind: TRANSACTION_KIND.WITHDRAW,
            status: TRANSACTION_STATUS.PENDING,
            recipient_address: body.recipient_address,
            from: userWallet._id,
            fee: "0", // TODO
            vaultody_transaction_request_id: transactionResponse.data.item.transactionRequestId,
            currency_code: currency.code,
            ...body,
          },
        ],
        { session: transaction.mongoose().session }
      );

      if (!withdraw_transaction) {
        throw new Error("Transaction could not be created");
      }

      await userWallet.save({ session: transaction.mongoose().session });

      await Notification.create(
        [{
          user: user._id,
          title: 'Withdraw Transaction',
          message: 'Amount has been withdrawn successfully.',
        }], transaction.mongoose())

      // Commit the transaction
      await transaction.commit();

      res.status(STATUS_CODE.OK).json({ withdraw_transaction });
    } catch (error) {
      if (transaction) await transaction.abort();
      console.log(error);
      console.error("Error in transaction:", JSON.stringify(error));
      console.error("Error in transaction->details:", error?.error?.details);
      throw new Error(error.message ? error?.message : error?.error?.message)

    }
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
