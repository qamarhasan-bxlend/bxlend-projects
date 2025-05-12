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
const CONTROLLER = [
  bodyParser.json(),
  validate({
    body: Joi.object().keys({
      walletId: Joi.string(),
      webhookId: Joi.string(),
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
          currentConfirmations: Joi.number(),
          targetConfirmations: Joi.number(),
          transactionId: Joi.string(),
          amount: Joi.string(),
          unit: Joi.string(),
          // direction: Joi.string(),
        }),
      }),
    }),
  }),
  async function incomingCoinConfirmedTransactionV1Controller(req, res) {
    const { body} = req;
    // change it after testing 
    const direction = "incoming";
    const title = 'Coin Deposit';
    
    console.log(req.body);
    console.log(req.body.data.item.minedInBlock)
    return res.status(200).send("Done");
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
  },


  //temp function to update currencies according to new model
  // async function incomingCoinConfirmedTransactionV1Controller(req, res) {
  //   const { Types } = require("mongoose");
  //   const {
  //     CryptoCurrency
  //   } = require("@src/models");
  //   const currencies = [
  //     {
  //       _id: Types.ObjectId("636e43b7990ac6256a17bee3"),  // Correct _id from your currency collection
  //       kind: "CRYPTO",
  //       code: "ETH",
  //       name: "Ethereum",
  //       decimals: 18,
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=002",
  //       website: "https://ethereum.org/en/",
  //       crypto_type: "coin",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum blockchain ObjectId
  //         }
  //       ]
  //     },
  //     {
  //       _id: Types.ObjectId("617f9c523b10379247059a9c"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "BTC",
  //       name: "Bitcoin",
  //       decimals: 8,  // Standard for Bitcoin
  //       display_decimals: 8,
  //       icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=014",
  //       website: "https://bitcoin.org",
  //       crypto_type: "coin",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f5978dd1cc9bb28375c"),  // Bitcoin blockchain ObjectId
  //         }
  //       ]
  //     },
  //     {
  //       _id: Types.ObjectId("63d932647238243d4e720a8e"),
  //       kind: "CRYPTO",
  //       code: "USDT",
  //       name: "Tether",
  //       decimals: 6,
  //       display_decimals: 6,
  //       icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=002",
  //       website: "https://tether.to/",
  //       crypto_type: "token",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum
  //           contract_address: "0xdac17f958d2ee523a2206206994597c13d831ec7"
  //         },
  //         {
  //           blockchain: Types.ObjectId("67092f6d78dd1cc9bb28375d"),  // Binance Smart Chain
  //           contract_address: "0x55d398326f99059ff775485246999027b3197955"
  //         },
  //         {
  //           blockchain: Types.ObjectId("67092f9978dd1cc9bb28375f"),  // Tron
  //           contract_address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
  //         }
  //       ]
  //     },
  //     {
  //       _id: Types.ObjectId("64edca8aafb73a16594d1132"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "SOL",
  //       name: "Solana",
  //       decimals: 9,  // Standard for Solana
  //       display_decimals: 9,
  //       icon: "https://cryptologos.cc/logos/solana-sol-logo.png?v=026",
  //       website: "https://solana.com/",
  //       crypto_type: "coin",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("670faf8b78dd1cc9bb283787"),  // Correct Solana blockchain ObjectId from your provided data
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:51.845Z"
  //     },
  //     {
  //       _id: Types.ObjectId("64fa3cf048e33739ff0d0136"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "MANA",
  //       name: "Decentraland",
  //       decimals: 18,  // Standard for MANA
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/decentraland-mana-logo.png?v=002",
  //       website: "https://decentraland.org/",
  //       crypto_type: "token",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum blockchain ObjectId
  //           contract_address: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942"  // MANA contract address on Ethereum
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:52.052Z"
  //     },
  //     {
  //       _id: Types.ObjectId("64fe309b4b7720c6330b26d8"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "LTC",
  //       name: "Litecoin",
  //       decimals: 8,  // Standard for Litecoin
  //       display_decimals: 8,
  //       icon: "https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=026",
  //       website: "https://litecoin.org/",
  //       crypto_type: "coin",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("670fb37278dd1cc9bb28378b")  // Correct Litecoin blockchain ObjectId from your provided data
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:52.152Z"
  //     },
  //     {
  //       _id: Types.ObjectId("65037e1e0fc503120156cf7e"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "XRP",
  //       name: "Ripple",
  //       decimals: 6,  // Standard for XRP
  //       display_decimals: 6,
  //       icon: "https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=002",
  //       website: "https://ripple.com/xrp/",
  //       crypto_type: "coin",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("670fb5df78dd1cc9bb28378f")  // Correct Ripple blockchain ObjectId from your newly created blockchain document
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:52.256Z"
  //     },
  //     {
  //       _id: Types.ObjectId("650380810fc503120156cf7f"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "ADA",
  //       name: "Cardano",
  //       decimals: 6,  // Standard for ADA
  //       display_decimals: 6,
  //       icon: "https://cryptologos.cc/logos/cardano-ada-logo.svg?v=002",
  //       website: "https://cardano.org/",
  //       crypto_type: "coin",
  //       supported_blockchains: []  // Since no blockchain will be supported in the system
  //     },
  //     {
  //       _id: Types.ObjectId("650381f20fc503120156cf80"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "BCH",
  //       name: "Bitcoin Cash",
  //       decimals: 8,  // Standard for Bitcoin Cash
  //       display_decimals: 8,
  //       icon: "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg?v=002",
  //       website: "https://bitcoincash.org/",
  //       crypto_type: "coin",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("670fb88d78dd1cc9bb283792")  // Correct Bitcoin Cash blockchain ObjectId from your newly provided blockchain document
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.367Z",
  //       updated_at: "2024-05-17T08:57:52.467Z"
  //     },
  //     {
  //       _id: Types.ObjectId("650383330fc503120156cf81"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "DOGE",
  //       name: "Dogecoin",
  //       decimals: 8,  // Standard for Dogecoin
  //       display_decimals: 8,
  //       icon: "https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=002",
  //       website: "https://dogecoin.com/",
  //       crypto_type: "coin",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("670fba4078dd1cc9bb283797")  // Correct Dogecoin blockchain ObjectId from your provided data
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.367Z",
  //       updated_at: "2024-05-17T08:57:52.570Z"
  //     },
  //     {
  //       _id: Types.ObjectId("650386320fc503120156cf83"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "DASH",
  //       name: "Dash",
  //       decimals: 8,  // Standard for Dash
  //       display_decimals: 8,
  //       icon: "https://cryptologos.cc/logos/dash-dash-logo.svg?v=002",
  //       website: "https://www.dash.org/",
  //       crypto_type: "coin",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("670fbb0478dd1cc9bb28379a")  // Correct Dash blockchain ObjectId from your newly provided blockchain document
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.367Z",
  //       updated_at: "2024-05-17T08:57:52.673Z"
  //     },
  //     {
  //       _id: Types.ObjectId("65049d168fe42e639ce9dc60"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "FET",
  //       name: "Fetch.ai",
  //       decimals: 18,  // Standard for ERC-20 and BEP-20 tokens
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/fetch-fet-logo.svg?v=002",
  //       website: "https://fetch.ai/",
  //       crypto_type: "token",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum blockchain ObjectId
  //           contract_address: "0xaea46a60368a7bd060eec7df8cba43b7ef41ad85"
  //         },
  //         {
  //           blockchain: Types.ObjectId("67092f6d78dd1cc9bb28375d"),  // Binance Smart Chain ObjectId
  //           contract_address: "0x031b41e504677879370e9DBcF937283A8691Fa7f"
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:52.777Z"
  //     },
  //     {
  //       _id: Types.ObjectId("65049e3f8fe42e639ce9dc61"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "FLR",
  //       name: "Flare",
  //       decimals: 18,  // Standard for Flare
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/flare-flr-logo.png",
  //       website: "https://flare.network/",
  //       crypto_type: "coin",
  //       supported_blockchains: [],  // Empty because no blockchain integration for withdrawals
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:52.876Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504a6d98fe42e639ce9dc62"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "AVAX",
  //       name: "Avalanche",
  //       decimals: 18,  // Standard for Avalanche
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  //       website: "https://www.avax.network/",
  //       crypto_type: "coin",
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("670fc50578dd1cc9bb28379d"),  // Correct Avalanche blockchain ObjectId from your newly provided blockchain document
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.367Z",
  //       updated_at: "2024-05-17T08:57:52.974Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504a7398fe42e639ce9dc63"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "DOT",
  //       name: "Polkadot",
  //       decimals: 10,  // Standard for Polkadot
  //       display_decimals: 10,
  //       icon: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
  //       website: "https://polkadot.network/",
  //       crypto_type: "coin",
  //       supported_blockchains: [],  // Empty since there is no withdrawal support
  //       created_at: "2021-11-01T07:50:42.367Z",
  //       updated_at: "2024-05-17T08:57:53.078Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504a7af8fe42e639ce9dc64"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "FTM",
  //       name: "Fantom",
  //       decimals: 18,  // Standard for Fantom
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/fantom-ftm-logo.png",
  //       website: "https://fantom.foundation/",
  //       crypto_type: "coin",
  //       supported_blockchains: [],
  //       created_at: "2021-11-01T07:50:42.367Z",
  //       updated_at: "2024-05-17T08:57:53.178Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504a8258fe42e639ce9dc65"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "GALA",
  //       name: "Gala",
  //       decimals: 8,  // Standard for Gala
  //       display_decimals: 8,
  //       icon: "https://cryptologos.cc/logos/gala-gala-logo.png",
  //       website: "https://games.gala.com/",
  //       crypto_type: "token",  // Classification as a token
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum
  //           contract_address: "0xd1d2Eb1B1e90B638588728b4130137D262C87cae"  // Correct ERC-20 address for Gala
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.367Z",
  //       updated_at: "2024-05-17T08:57:53.287Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504a8858fe42e639ce9dc66"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "HBAR",
  //       name: "Hedera Hashgraph",
  //       decimals: 8,  // Standard for HBAR
  //       display_decimals: 8,
  //       icon: "https://cryptologos.cc/logos/hedera-hashgraph-hbar-logo.png",
  //       website: "https://hedera.com/",
  //       crypto_type: "coin",  // Classification as a coin
  //       supported_blockchains: [],  // No withdrawal support indicated
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:53.409Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504a90c8fe42e639ce9dc67"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "KNC",
  //       name: "Kyber Network Crystal",
  //       decimals: 18,  // Standard for KNC
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/kyber-network-knc-logo.png",
  //       website: "https://kyber.network/",
  //       crypto_type: "token",  // Classification as a token
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum
  //           contract_address: "0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202"  // Correct ERC-20 address for KNC
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.367Z",
  //       updated_at: "2024-05-17T08:57:53.518Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504aa098fe42e639ce9dc69"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "LRC",
  //       name: "Loopring",
  //       decimals: 18,  // Standard for Loopring
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/loopring-lrc-logo.svg?v=002",
  //       website: "https://loopring.org/#/",
  //       crypto_type: "token",  // Classification as a token
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum
  //           contract_address: "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd"
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:53.733Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504a9818fe42e639ce9dc68"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "LINK",
  //       name: "Chainlink",
  //       decimals: 18,  // Standard for Chainlink
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/chainlink-link-logo.svg?v=002",
  //       website: "https://chain.link/",
  //       crypto_type: "token",  // Classification as a token
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum
  //           contract_address: "0x514910771af9ca656af840dff83e8264ecf986ca"
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:53.627Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504ab018fe42e639ce9dc6a"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "MATIC",
  //       name: "Polygon",
  //       decimals: 18,  // Standard for MATIC
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  //       website: "https://polygon.technology/",
  //       crypto_type: "token",  // Classification as a token
  //       supported_blockchains: [],  // Empty since withdrawals are not allowed at the moment
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:53.865Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504ab7e8fe42e639ce9dc6b"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "NEAR",
  //       name: "Near Protocol",
  //       decimals: 24,  // NEAR uses 24 decimals
  //       display_decimals: 24,
  //       icon: "https://cryptologos.cc/logos/near-protocol-near-logo.png",
  //       website: "https://near.org/",
  //       crypto_type: "coin",  // Classification as a coin
  //       supported_blockchains: [],  // No blockchains listed
  //       created_at: "2021-11-01T07:50:42.367Z",
  //       updated_at: "2024-05-17T08:57:54.043Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504abe28fe42e639ce9dc6c"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "SAND",
  //       name: "The Sandbox",
  //       decimals: 18,  // Standard for SAND
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/the-sandbox-sand-logo.png",
  //       website: "https://www.sandbox.game/en/",
  //       crypto_type: "token",  // Classification as a token
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum
  //           contract_address: "0x3845badade8e6dff049820680d1f14bd3903a5d0"  // Correct ERC-20 address for SAND
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:54.462Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504ac4b8fe42e639ce9dc6d"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "SHIB",
  //       name: "Shiba Inu",
  //       decimals: 18,  // Standard for SHIB
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
  //       website: "https://www.shibatoken.com/",
  //       crypto_type: "token",  // Classification as a token
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum
  //           contract_address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"  // Correct ERC-20 address for SHIB
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:55.565Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504ad308fe42e639ce9dc6e"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "SKL",
  //       name: "Skale",
  //       decimals: 18,  // Standard for SKL
  //       display_decimals: 18,
  //       icon: "https://thumbs.dreamstime.com/z/skale-skl-cryptocurrency-token-symbol-coin-icon-circle-pcb-red-background-vector-illustration-techno-style-website-203496204.jpg?w=768",
  //       website: "https://skale.space/",
  //       crypto_type: "token",  // Classification as a token
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum
  //           contract_address: "0x00c83aecc790e8a4453e5dd3b0b4b3680501a7a7"  // Correct ERC-20 address for SKL
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:55.665Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6504adad8fe42e639ce9dc6f"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "SLP",
  //       name: "Smooth Love Potion",
  //       decimals: 18,  // Standard for SLP
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/smooth-love-potion-slp-logo.png",
  //       website: "https://www.axieinfinity.com/",
  //       crypto_type: "token",  // Classification as a token
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f2178dd1cc9bb28375b"),  // Ethereum
  //           contract_address: "0xcc8fa225d80b9c7d42f96e9570156c65d6caaa25"  // Correct ERC-20 address for SLP
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:55.772Z"
  //     },
  //     {
  //       _id: Types.ObjectId("6707a7336a3ec5613f44b4a4"),  // Correct _id from your provided data
  //       kind: "CRYPTO",
  //       code: "BNB",
  //       name: "Binance Coin",
  //       decimals: 18,  // Standard for BNB
  //       display_decimals: 18,
  //       icon: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  //       website: "https://www.binance.com/",
  //       crypto_type: "coin",  // Classification as a coin
  //       supported_blockchains: [
  //         {
  //           blockchain: Types.ObjectId("67092f6d78dd1cc9bb28375d"),  // Binance Smart Chain
  //         }
  //       ],
  //       created_at: "2021-11-01T07:50:42.715Z",
  //       updated_at: "2024-05-17T08:57:55.772Z"
  //     }
      
      
      
      
  //     // Add other currency objects here
  //   ];

  //   try{
  //     for (const currency of currencies) {
  //       const query = { _id: currency._id }; // Use _id for matching
  //       const update = { $set: currency };   // Set the new data
  //       const options = { upsert: true, new: true }; // Insert if not found, otherwise update
  //       await CryptoCurrency.findOneAndUpdate(query, update, options);
  //       console.log(`Upserted currency with ID: ${currency._id}`);
  //     }
  //   }catch(error){
  //     console.log(error);
  //   }
    

  //   console.log(currencies);
  //   return res.json(currencies)
  // },

  // async function incomingCoinConfirmedTransactionV1Controller(req, res) {
  //   const { Types } = require("mongoose");
  //   const {
  //     Blockchain
  //   } = require("@src/models");
    

  //   const blockchains = [
  //       {
  //         "_id": "67092f2178dd1cc9bb28375b",
  //         "name": "Ethereum",
  //         "symbol": "ETH",
  //         "description": "Ethereum is a decentralized platform that supports smart contracts.",
  //         "website": "https://ethereum.org",
  //         "native_currency": "ETH",
  //         "networks": [
  //           {
  //             "network_name": "Mainnet",
  //             "network_type": "mainnet",
  //             "chain_id": 1,
  //             "rpc_url": "https://mainnet.infura.io/v3/YOUR-PROJECT-ID"
  //           },
  //           {
  //             "network_name": "Ropsten",
  //             "network_type": "testnet",
  //             "chain_id": 3,
  //             "rpc_url": "https://ropsten.infura.io/v3/YOUR-PROJECT-ID"
  //           }
  //         ],
  //         "token_standards": [
  //           {
  //             "standard_name": "ERC-20",
  //             "description": "Ethereum token standard"
  //           }
  //         ],
  //         "platforms": [
  //           {
  //             "platform_name": "VAULTODY",
  //             "platform_id": "66f3d7c605a2350007d00102",
  //             "platform_options": {
  //               "label": "bxlend-test",
  //               "network": "testnet"
  //             }
  //           }
  //         ]
  //       },
  //       {
  //         "_id": "67092f5978dd1cc9bb28375c",
  //         "name": "Bitcoin",
  //         "symbol": "BTC",
  //         "description": "Bitcoin is the original decentralized cryptocurrency.",
  //         "website": "https://bitcoin.org",
  //         "native_currency": "BTC",
  //         "networks": [
  //           {
  //             "network_name": "Mainnet",
  //             "network_type": "mainnet",
  //             "chain_id": 0,
  //             "rpc_url": "https://mainnet.bitcoin.org"
  //           },
  //           {
  //             "network_name": "Testnet",
  //             "network_type": "testnet",
  //             "chain_id": 18332,
  //             "rpc_url": "https://testnet3.bitcoin.org"
  //           }
  //         ],
  //         "platforms": [
  //           {
  //             "platform_name": "VAULTODY",
  //             "platform_id": "66f3d7c605a2350007d00102",
  //             "platform_options": {
  //               "label": "bxlend-test",
  //               "network": "testnet"
  //             }
  //           }
  //         ]
  //       },
  //       {
  //         "_id": "67092f6d78dd1cc9bb28375d",
  //         "name": "Binance Smart Chain",
  //         "symbol": "BNB",
  //         "description": "Binance Smart Chain runs parallel to Binance Chain.",
  //         "website": "https://www.binance.org",
  //         "native_currency": "BNB",
  //         "networks": [
  //           {
  //             "network_name": "Mainnet",
  //             "network_type": "mainnet",
  //             "chain_id": 56,
  //             "rpc_url": "https://bsc-dataseed.binance.org/"
  //           },
  //           {
  //             "network_name": "Testnet",
  //             "network_type": "testnet",
  //             "chain_id": 97,
  //             "rpc_url": "https://data-seed-prebsc-1-s1.binance.org:8545/"
  //           }
  //         ],
  //         "token_standards": [
  //           {
  //             "standard_name": "BEP-20",
  //             "description": "Binance token standard"
  //           }
  //         ],
  //         "platforms": [
  //           {
  //             "platform_name": "VAULTODY",
  //             "platform_id": "66f3d7c605a2350007d00102",
  //             "platform_options": {
  //               "label": "bxlend-test",
  //               "network": "testnet"
  //             }
  //           }
  //         ]
  //       },
  //       {
  //         "_id": "67092f9978dd1cc9bb28375f",
  //         "name": "Tron",
  //         "symbol": "TRX",
  //         "description": "Tron is a decentralized platform focused on content sharing.",
  //         "website": "https://tron.network",
  //         "native_currency": "TRX",
  //         "networks": [
  //           {
  //             "network_name": "Mainnet",
  //             "network_type": "mainnet",
  //             "chain_id": 1,
  //             "rpc_url": "https://api.trongrid.io"
  //           },
  //           {
  //             "network_name": "Nile",
  //             "network_type": "testnet",
  //             "chain_id": 201910292,
  //             "rpc_url": "https://nile.trongrid.io"
  //           }
  //         ],
  //         "token_standards": [
  //           {
  //             "standard_name": "TRC-20",
  //             "description": "Tron token standard"
  //           }
  //         ],
  //         "platforms": [
  //           {
  //             "platform_name": "VAULTODY",
  //             "platform_id": "66f3d7c605a2350007d00102",
  //             "platform_options": {
  //               "label": "bxlend-test",
  //               "network": "testnet"
  //             }
  //           }
  //         ]
  //       },
  //       {
  //         "_id": "670fb37278dd1cc9bb28378b",
  //         "name": "Litecoin",
  //         "symbol": "LTC",
  //         "description": "Litecoin is a peer-to-peer cryptocurrency.",
  //         "website": "https://litecoin.org/",
  //         "native_currency": "LTC",
  //         "networks": [
  //           {
  //             "network_name": "Mainnet",
  //             "network_type": "mainnet",
  //             "rpc_url": "https://litecoin-rpc.com"
  //           },
  //           {
  //             "network_name": "Testnet",
  //             "network_type": "testnet",
  //             "rpc_url": "https://litecoin-testnet-rpc.com"
  //           }
  //         ],
  //         "platforms": [
  //           {
  //             "platform_name": "VAULTODY",
  //             "platform_id": "66f3d7c605a2350007d00102",
  //             "platform_options": {
  //               "label": "bxlend-test",
  //               "network": "testnet"
  //             }
  //           }
  //         ]
  //       },
  //       {
  //         "_id": "670fb5df78dd1cc9bb28378f",
  //         "name": "Ripple",
  //         "symbol": "XRP",
  //         "description": "Ripple is a real-time gross settlement system.",
  //         "website": "https://ripple.com/xrp/",
  //         "native_currency": "XRP",
  //         "networks": [
  //           {
  //             "network_name": "Mainnet",
  //             "network_type": "mainnet",
  //             "rpc_url": "https://s1.ripple.com:51234/"
  //           },
  //           {
  //             "network_name": "Testnet",
  //             "network_type": "testnet",
  //             "rpc_url": "https://s.altnet.rippletest.net:51234/"
  //           }
  //         ],
  //         "platforms": [
  //           {
  //             "platform_name": "VAULTODY",
  //             "platform_id": "66f3d7c605a2350007d00102",
  //             "platform_options": {
  //               "label": "bxlend-test",
  //               "network": "testnet"
  //             }
  //           }
  //         ]
  //       },
  //       {
  //         "_id": "670fb88d78dd1cc9bb283792",
  //         "name": "Bitcoin Cash",
  //         "symbol": "BCH",
  //         "description": "Bitcoin Cash is a fork of Bitcoin focusing on low fees.",
  //         "website": "https://bitcoincash.org/",
  //         "native_currency": "BCH",
  //         "networks": [
  //           {
  //             "network_name": "Mainnet",
  //             "network_type": "mainnet",
  //             "rpc_url": "https://bchd-wallet-service.bitcoinunlimited.info"
  //           },
  //           {
  //             "network_name": "Testnet",
  //             "network_type": "testnet",
  //             "rpc_url": "https://testnet.bchd.cash"
  //           }
  //         ],
  //         "platforms": [
  //           {
  //             "platform_name": "VAULTODY",
  //             "platform_id": "66f3d7c605a2350007d00102",
  //             "platform_options": {
  //               "label": "bxlend-test",
  //               "network": "testnet"
  //             }
  //           }
  //         ]
  //       },
  //       {
  //         "_id": "670fba4078dd1cc9bb283797",
  //         "name": "Dogecoin",
  //         "symbol": "DOGE",
  //         "description": "Dogecoin is a decentralized digital currency.",
  //         "website": "https://dogecoin.com/",
  //         "native_currency": "DOGE",
  //         "networks": [
  //           {
  //             "network_name": "Mainnet",
  //             "network_type": "mainnet",
  //             "rpc_url": "https://dogecoin-rpc.com"
  //           },
  //           {
  //             "network_name": "Testnet",
  //             "network_type": "testnet",
  //             "rpc_url": "https://testnet.dogecoin-rpc.com"
  //           }
  //         ],
  //         "platforms": [
  //           {
  //             "platform_name": "VAULTODY",
  //             "platform_id": "66f3d7c605a2350007d00102",
  //             "platform_options": {
  //               "label": "bxlend-test",
  //               "network": "testnet"
  //             }
  //           }
  //         ]
  //       },
  //       {
  //         "_id": "670fbb0478dd1cc9bb28379a",
  //         "name": "Dash",
  //         "symbol": "DASH",
  //         "description": "Dash is an open-source cryptocurrency that focuses on offering a fast, affordable, and secure way to make digital payments.",
  //         "website": "https://www.dash.org/",
  //         "native_currency": "DASH",
  //         "networks": [
  //           {
  //             "network_name": "Mainnet",
  //             "network_type": "mainnet",
  //             "chain_id": null,
  //             "rpc_url": "https://dash-rpc.com"
  //           },
  //           {
  //             "network_name": "Testnet",
  //             "network_type": "testnet",
  //             "chain_id": null,
  //             "rpc_url": "https://testnet.dash-rpc.com"
  //           }
  //         ],
  //         "token_standards": [],
  //         "platforms": [
  //           {
  //             "platform_name": "VAULTODY",
  //             "platform_id": "66f3d7c605a2350007d00102",
  //             "platform_options": {
  //               "label": "bxlend-test",
  //               "network": "testnet"
  //             }
  //           }
  //         ]
  //       },
  //       {
  //         "_id": "670fc50578dd1cc9bb28379d",
  //         "name": "Avalanche",
  //         "symbol": "AVAX",
  //         "description": "Avalanche is a highly scalable blockchain platform for decentralized applications and enterprise blockchain deployments.",
  //         "website": "https://www.avax.network/",
  //         "native_currency": "AVAX",
  //         "networks": [
  //           {
  //             "network_name": "Mainnet",
  //             "network_type": "mainnet",
  //             "chain_id": 43114,
  //             "rpc_url": "https://api.avax.network/ext/bc/C/rpc"
  //           },
  //           {
  //             "network_name": "Fuji",
  //             "network_type": "testnet",
  //             "chain_id": 43113,
  //             "rpc_url": "https://api.avax-test.network/ext/bc/C/rpc"
  //           }
  //         ],
  //         "token_standards": [
  //           {
  //             "standard_name": "ARC-20",
  //             "description": "Avalanche token standard similar to Ethereum's ERC-20."
  //           }
  //         ],
  //         "platforms": [
  //           {
  //             "platform_name": "VAULTODY",
  //             "platform_id": "66f3d7c605a2350007d00102",
  //             "platform_options": {
  //               "label": "bxlend-test",
  //               "network": "testnet"
  //             }
  //           }
  //         ]
  //       }                
  //   ]
  //   try {
  //   for (const blockchain of blockchains) {
  //     const query = { _id: blockchain._id }; // Use _id for matching
  //     const update = { $set: blockchain };   // Set the new data
  //     const options = { upsert: true, new: true }; // Insert if not found, otherwise update
  //     await Blockchain.findOneAndUpdate(query, update, options);
  //     console.log(`Upserted blockchain with ID: ${blockchain._id}`);
  //   }
  // } catch (error) {
  //   console.log(error);
  // }

  // console.log(blockchains);
  // return res.json(blockchains);
  // }
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
