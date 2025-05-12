"use strict";

/* eslint-env jest */

const faker = require("faker");

// ------------------------- Wallet --------------------------

exports.getWallet = jest
  .fn()
  .mockName("getWallet")
  .mockImplementation(async (coin) => {
    return {
      coin: coin,
      wallets: [
        {
          id: "60da3afcfbd14500062132144a260145",
          users: [
            {
              user: "6089371b66cbab0006474705b017c17d",
              permissions: ["admin", "view", "spend"],
            },
          ],
          coin,
          label: faker.datatype.string(),
          m: faker.datatype.number(),
          n: faker.datatype.number(),
          keys: [
            "60da3aeaaecb260006b2b2fd9a6463d9",
            "60da3aecaaa8b400069d4f218c6f4204",
            "60da3aede186f300065e22e899275729",
          ],
          keySignatures: {},
          tags: ["60da3afcfbd14500062132144a260145"],
          disableTransactionNotifications: faker.datatype.boolean(),
          freeze: {},
          deleted: faker.datatype.boolean(),
          approvalsRequired: faker.datatype.number(),
          isCold: faker.datatype.boolean(),
          coinSpecific: {},
          admin: {},
          clientFlags: [],
          allowBackupKeySigning: faker.datatype.boolean(),
          startDate: faker.date.recent(),
          type: "hot",
          buildDefaults: {},
          customChangeKeySignatures: {},
          hasLargeNumberOfAddresses: faker.datatype.boolean(),
          config: {},
        },
      ],
    };
  });

exports.getAllWallets = jest
  .fn()
  .mockName("getAllWallets")
  .mockImplementation(async () => {
    return {
      wallets: [
        {
          id: "60da3afcfbd14500062132144a260145",
          users: [
            {
              user: "6089371b66cbab0006474705b017c17d",
              permissions: ["admin", "view", "spend"],
            },
          ],
          coin: "tbtc",
          label: faker.datatype.string(),
          m: faker.datatype.number(),
          n: faker.datatype.number(),
          keys: [
            "60da3aeaaecb260006b2b2fd9a6463d9",
            "60da3aecaaa8b400069d4f218c6f4204",
            "60da3aede186f300065e22e899275729",
          ],
          keySignatures: {},
          tags: ["60da3afcfbd14500062132144a260145"],
          disableTransactionNotifications: faker.datatype.boolean(),
          freeze: {},
          deleted: faker.datatype.boolean(),
          approvalsRequired: faker.datatype.number(),
          isCold: faker.datatype.boolean(),
          coinSpecific: {},
          admin: {},
          clientFlags: [],
          allowBackupKeySigning: faker.datatype.boolean(),
          startDate: faker.date.recent(),
          type: "hot",
          buildDefaults: {},
          customChangeKeySignatures: {},
          hasLargeNumberOfAddresses: faker.datatype.boolean(),
          config: {},
        },
      ],
    };
  });

exports.getWalletByAddress = jest
  .fn()
  .mockName("getWalletByAddress")
  .mockImplementation(async (coin) => {
    return {
      wallets: [
        {
          id: "60da3afcfbd14500062132144a260145",
          users: [
            {
              user: "6089371b66cbab0006474705b017c17d",
              permissions: ["admin", "view", "spend"],
            },
          ],
          coin: coin,
          label: faker.datatype.string(),
          m: faker.datatype.number(),
          n: faker.datatype.number(),
          keys: [
            "60da3aeaaecb260006b2b2fd9a6463d9",
            "60da3aecaaa8b400069d4f218c6f4204",
            "60da3aede186f300065e22e899275729",
          ],
          keySignatures: {},
          tags: ["60da3afcfbd14500062132144a260145"],
          disableTransactionNotifications: faker.datatype.boolean(),
          freeze: {},
          deleted: faker.datatype.boolean(),
          approvalsRequired: faker.datatype.number(),
          isCold: faker.datatype.boolean(),
          coinSpecific: {},
          admin: {},
          clientFlags: [],
          allowBackupKeySigning: faker.datatype.boolean(),
          startDate: faker.date.recent(),
          type: "hot",
          buildDefaults: {},
          customChangeKeySignatures: {},
          hasLargeNumberOfAddresses: faker.datatype.boolean(),
          config: {},
        },
      ],
    };
  });

exports.updateWallet = jest
  .fn()
  .mockName("updateWallet")
  .mockImplementation(async (coin, walletId) => {
    return {
      admin: {
        policy: {
          id: "59cd72485007a239fb00282ed480da1f",
          date: "2021-06-29T12:00:37Z",
          label: "string",
          latest: true,
          rules: [
            {
              id: "string",
              lockDate: "2021-06-29T12:00:37Z",
              mutabilityConstraint: "managed",
              coin,
              type: "advancedWhitelist",
              condition: {
                amountString: "2000000",
                timeWindow: 0,
                groupTags: ["59cd72485007a239fb00282ed480da1f"],
                excludeTags: ["59cd72485007a239fb00282ed480da1f"],
              },
              action: {
                type: "deny",
                approvalsRequired: 1,
                userIds: ["59cd72485007a239fb00282ed480da1f"],
              },
            },
          ],
          version: 0,
        },
      },
      allowBackupKeySigning: true,
      approvalsRequired: 1,
      balanceString: "string",
      buildDefaults: {
        minFeeRate: 12000,
      },
      coin,
      coinSpecific: {
        creationFailure: ["b8a828b98dbf32d9fd1875cbace9640ceb8c82626716b4a64203fdc79bb46d26"],
        pendingChainInitialization: true,
        rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
        stellarUsername: "foo_bar@baz.com",
        homeDomain: "bitgo.com",
        stellarAddress: "foo_bar@baz.com*bitgo.com",
      },
      custodialWallet: {},
      custodialWalletId: "59cd72485007a239fb00282ed480da1f",
      deleted: true,
      disableTransactionNotifications: true,
      enterprise: "59cd72485007a239fb00282ed480da1f",
      freeze: {
        time: "string",
        expires: "string",
      },
      id: walletId,
      isCold: true,
      keys: ["585951a5df8380e0e304a553", "585951a5df8380e0e30d645c", "585951a5df8380e0e30b6147"],
      label: "My Wallet",
      m: 2,
      n: 3,
      nodeId: "59cd72485007a239fb00282ed480da1f",
      receiveAddress: {
        id: "59cd72485007a239fb00282ed480da1f",
        address: "2MvrwRYBAuRtPTiZ5MyKg42Ke55W3fZJfZS",
        chain: 1,
        index: 0,
        coin: "string",
        lastNonce: -1,
        wallet: "59cd72485007a239fb00282ed480da1f",
        coinSpecific: {
          xlm: {
            memoId: "2000000",
            rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
          },
          txlm: {
            memoId: "2000000",
            rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
          },
        },
        label: "Bob's Hot Wallet Address",
        addressType: "p2sh",
      },
      recoverable: true,
      tags: ["59cd72485007a239fb00282ed480da1f"],
      spendableBalanceString: "string",
      startDate: "string",
      type: "cold",
      users: [
        {
          user: "55e8a1a5df8380e0e30e20c6",
          permissions: ["admin", "view", "spend"],
        },
      ],
      customChangeKeySignatures: {
        user: "string",
        backup: "string",
        bitgo: "string",
      },
    };
  });

exports.createWallet = jest
  .fn()
  .mockName("createWallet")
  .mockImplementation(async (coin) => {
    return {
      admin: {
        policy: {
          id: "59cd72485007a239fb00282ed480da1f",
          date: "2021-06-29T12:00:37Z",
          label: "string",
          latest: true,
          rules: [
            {
              id: "string",
              lockDate: "2021-06-29T12:00:37Z",
              mutabilityConstraint: "managed",
              coin,
              type: "advancedWhitelist",
              condition: {
                amountString: "2000000",
                timeWindow: 0,
                groupTags: ["59cd72485007a239fb00282ed480da1f"],
                excludeTags: ["59cd72485007a239fb00282ed480da1f"],
              },
              action: {
                type: "deny",
                approvalsRequired: 1,
                userIds: ["59cd72485007a239fb00282ed480da1f"],
              },
            },
          ],
          version: 0,
        },
      },
      allowBackupKeySigning: true,
      approvalsRequired: 1,
      balanceString: "string",
      buildDefaults: {
        minFeeRate: 12000,
      },
      coin: "btc",
      coinSpecific: {
        creationFailure: ["b8a828b98dbf32d9fd1875cbace9640ceb8c82626716b4a64203fdc79bb46d26"],
        pendingChainInitialization: true,
        rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
        stellarUsername: "foo_bar@baz.com",
        homeDomain: "bitgo.com",
        stellarAddress: "foo_bar@baz.com*bitgo.com",
      },
      custodialWallet: {},
      custodialWalletId: "59cd72485007a239fb00282ed480da1f",
      deleted: true,
      disableTransactionNotifications: true,
      enterprise: "59cd72485007a239fb00282ed480da1f",
      freeze: {
        time: "string",
        expires: "string",
      },
      id: "59cd72485007a239fb00282ed480da1f",
      isCold: true,
      keys: ["585951a5df8380e0e304a553", "585951a5df8380e0e30d645c", "585951a5df8380e0e30b6147"],
      label: "My Wallet",
      m: 2,
      n: 3,
      nodeId: "59cd72485007a239fb00282ed480da1f",
      receiveAddress: {
        id: "59cd72485007a239fb00282ed480da1f",
        address: "2MvrwRYBAuRtPTiZ5MyKg42Ke55W3fZJfZS",
        chain: 1,
        index: 0,
        coin: "string",
        lastNonce: -1,
        wallet: "59cd72485007a239fb00282ed480da1f",
        coinSpecific: {
          xlm: {
            memoId: "2000000",
            rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
          },
          txlm: {
            memoId: "2000000",
            rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
          },
        },
        label: "Bob's Hot Wallet Address",
        addressType: "p2sh",
      },
      recoverable: true,
      tags: ["59cd72485007a239fb00282ed480da1f"],
      spendableBalanceString: "string",
      startDate: "string",
      type: "cold",
      users: [
        {
          user: "55e8a1a5df8380e0e30e20c6",
          permissions: ["admin", "view", "spend"],
        },
      ],
      customChangeKeySignatures: {
        user: "string",
        backup: "string",
        bitgo: "string",
      },
    };
  });

exports.removeWallet = jest
  .fn()
  .mockName("removeWallet")
  .mockImplementation(async (coin, walletId) => {
    return {
      admin: {
        policy: {
          id: "59cd72485007a239fb00282ed480da1f",
          date: "2021-06-29T12:00:37Z",
          label: "string",
          latest: true,
          rules: [
            {
              id: "string",
              lockDate: "2021-06-29T12:00:37Z",
              mutabilityConstraint: "managed",
              coin: "btc",
              type: "advancedWhitelist",
              condition: {
                amountString: "2000000",
                timeWindow: 0,
                groupTags: ["59cd72485007a239fb00282ed480da1f"],
                excludeTags: ["59cd72485007a239fb00282ed480da1f"],
              },
              action: {
                type: "deny",
                approvalsRequired: 1,
                userIds: ["59cd72485007a239fb00282ed480da1f"],
              },
            },
          ],
          version: 0,
        },
      },
      allowBackupKeySigning: true,
      approvalsRequired: 1,
      balanceString: "string",
      buildDefaults: {
        minFeeRate: 12000,
      },
      coin,
      coinSpecific: {
        creationFailure: ["b8a828b98dbf32d9fd1875cbace9640ceb8c82626716b4a64203fdc79bb46d26"],
        pendingChainInitialization: true,
        rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
        stellarUsername: "foo_bar@baz.com",
        homeDomain: "bitgo.com",
        stellarAddress: "foo_bar@baz.com*bitgo.com",
      },
      custodialWallet: {},
      custodialWalletId: walletId,
      deleted: true,
      disableTransactionNotifications: true,
      enterprise: walletId,
      freeze: {
        time: "string",
        expires: "string",
      },
      id: walletId,
      isCold: true,
      keys: ["585951a5df8380e0e304a553", "585951a5df8380e0e30d645c", "585951a5df8380e0e30b6147"],
      label: "My Wallet",
      m: 2,
      n: 3,
      nodeId: walletId,
      receiveAddress: {
        id: walletId,
        address: "2MvrwRYBAuRtPTiZ5MyKg42Ke55W3fZJfZS",
        chain: 1,
        index: 0,
        coin: "string",
        lastNonce: -1,
        wallet: walletId,
        coinSpecific: {
          xlm: {
            memoId: "2000000",
            rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
          },
          txlm: {
            memoId: "2000000",
            rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
          },
        },
        label: "Bob's Hot Wallet Address",
        addressType: "p2sh",
      },
      recoverable: true,
      tags: ["59cd72485007a239fb00282ed480da1f"],
      spendableBalanceString: "string",
      startDate: "string",
      type: "cold",
      users: [
        {
          user: "55e8a1a5df8380e0e30e20c6",
          permissions: ["admin", "view", "spend"],
        },
      ],
      customChangeKeySignatures: {
        user: "string",
        backup: "string",
        bitgo: "string",
      },
    };
  });

exports.freezeWallet = jest
  .fn()
  .mockName("freezeWallet")
  .mockImplementation(async () => {
    return {
      time: faker.date.recent(),
      expires: faker.date.recent(),
    };
  });

exports.getWalletUnspents = jest
  .fn()
  .mockName("getWalletUnspents")
  .mockImplementation(async (coin, walletId) => {
    return {
      coin,
      unspents: [
        {
          id: "003f688cc349f1fca8ac5ffa21671ca911b6ef351085c60733ed8c2ebf162cb8:2",
          address: "2MsKxhhkDo5WaLaYRGA9Cr3iSQPyXsu6Fi2",
          value: 0,
          valueString: faker.datatype.number(),
          blockHeight: 0,
          date: faker.date.past(),
          coinbase: faker.datatype.boolean(),
          wallet: walletId,
          fromWallet: walletId,
          chain: 0,
          index: 0,
          redeemScript:
						"522102f1e990044d2a8be43d5b500bbdcb36277b97a4b07e01c5101ae8ec1568bfd6532103dab7dc82f2fc8c28200c1bdeca9c4cf181e0ca257395829cbd599395048afb57210205422e711827d8356f2fb75334d863941dd7eb45bd5788fa231dc5fa755135b653ae",
          witnessScript:
						"52210351311cd81144e6cbdba561d24dfc22644cb02d053339d4beace03231b3be4f372103a8d0c1a375b9ee1a2411f9f8e18373be7f228b18260f63bbfca48809170ed08b2103c3bd8bd074657bbe9ee6714b31a4a54b6fd5b5cda0e1030122f9bf46b5034f6b53ae",
          isSegwit: faker.datatype.boolean(),
        },
      ],
    };
  });

exports.getWalletMaximumSpendable = jest
  .fn()
  .mockName("getWalletMaximumSpendable")
  .mockImplementation(async (coin) => {
    return {
      coin,
      maximumSpendable: faker.datatype.number(),
    };
  });

exports.getWalletSpendingLimits = jest
  .fn()
  .mockName("getWalletSpendingLimits")
  .mockImplementation(async (coin) => {
    return {
      velocityLimitSpending: [
        {
          coin,
          timeWindow: faker.datatype.number().toString(),
          limitAmountString: faker.datatype.number().toString(),
          amountSpentString: faker.datatype.number().toString(),
        },
      ],
    };
  });

exports.getWalletAllReservedUnspent = jest
  .fn()
  .mockName("getWalletAllReservedUnspent")
  .mockImplementation(async (walletId) => {
    return {
      unspents: [
        {
          id: "003f688cc349f1fca8ac5ffa21671ca911b6ef351085c60733ed8c2ebf162cb8:2",
          walletId,
          expireTime: faker.date.future(),
          userId: "59cd72485007a239fb00282ed480da1f",
        },
      ],
      nextBatchPrevId: "string",
    };
  });

exports.getWalletAllBalancesWallet = jest
  .fn()
  .mockName("getWalletAllBalancesWallet")
  .mockImplementation(async ({ coin } = {}) => {
    return {
      balances: [
        {
          balanceString: "string",
          coin,
        },
      ],
    };
  });

exports.getWalletBalanceReserveData = jest
  .fn()
  .mockName("getWalletBalanceReserveData")
  .mockImplementation(async () => {
    return {
      baseFee: faker.datatype.number().toString(),
      baseReserve: faker.datatype.number().toString(),
      reserve: faker.datatype.number().toString(),
      minimumFunding: faker.datatype.number().toString(),
      height: faker.datatype.number(),
    };
  });

exports.makeWalletReservedUnspents = jest
  .fn()
  .mockName("makeWalletReservedUnspents")
  .mockImplementation(async (walletId) => {
    return {
      unspents: [
        {
          id: "003f688cc349f1fca8ac5ffa21671ca911b6ef351085c60733ed8c2ebf162cb8:2",
          walletId,
          expireTime: faker.date.future(),
          userId: "59cd72485007a239fb00282ed480da1f",
        },
      ],
    };
  });

exports.modifyWalletReservedUnspents = jest
  .fn()
  .mockName("modifyWalletReservedUnspents")
  .mockImplementation(async (walletId) => {
    return {
      unspents: [
        {
          id: "003f688cc349f1fca8ac5ffa21671ca911b6ef351085c60733ed8c2ebf162cb8:2",
          walletId,
          expireTime: faker.date.future(),
          userId: "59cd72485007a239fb00282ed480da1f",
        },
      ],
    };
  });

exports.removeWalletUserFrom = jest
  .fn()
  .mockName("removeWalletUserFrom")
  .mockImplementation(async () => {
    return {
      admin: {
        policy: {
          id: "59cd72485007a239fb00282ed480da1f",
          date: "2021-06-29T12:00:37Z",
          label: "string",
          latest: true,
          rules: [
            {
              id: "string",
              lockDate: "2021-06-29T12:00:37Z",
              mutabilityConstraint: "managed",
              coin: "btc",
              type: "advancedWhitelist",
              condition: {
                amountString: "2000000",
                timeWindow: 0,
                groupTags: ["59cd72485007a239fb00282ed480da1f"],
                excludeTags: ["59cd72485007a239fb00282ed480da1f"],
              },
              action: {
                type: "deny",
                approvalsRequired: 1,
                userIds: ["59cd72485007a239fb00282ed480da1f"],
              },
            },
          ],
          version: 0,
        },
      },
      allowBackupKeySigning: true,
      approvalsRequired: 1,
      balanceString: "string",
      buildDefaults: {
        minFeeRate: 12000,
      },
      coin: "btc",
      coinSpecific: {
        creationFailure: ["b8a828b98dbf32d9fd1875cbace9640ceb8c82626716b4a64203fdc79bb46d26"],
        pendingChainInitialization: true,
        rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
        stellarUsername: "foo_bar@baz.com",
        homeDomain: "bitgo.com",
        stellarAddress: "foo_bar@baz.com*bitgo.com",
      },
      custodialWallet: {},
      custodialWalletId: "59cd72485007a239fb00282ed480da1f",
      deleted: true,
      disableTransactionNotifications: true,
      enterprise: "59cd72485007a239fb00282ed480da1f",
      freeze: {
        time: "string",
        expires: "string",
      },
      id: "59cd72485007a239fb00282ed480da1f",
      isCold: true,
      keys: ["585951a5df8380e0e304a553", "585951a5df8380e0e30d645c", "585951a5df8380e0e30b6147"],
      label: "My Wallet",
      m: 2,
      n: 3,
      nodeId: "59cd72485007a239fb00282ed480da1f",
      receiveAddress: {
        id: "59cd72485007a239fb00282ed480da1f",
        address: "2MvrwRYBAuRtPTiZ5MyKg42Ke55W3fZJfZS",
        chain: 1,
        index: 0,
        coin: "string",
        lastNonce: -1,
        wallet: "59cd72485007a239fb00282ed480da1f",
        coinSpecific: {
          xlm: {
            memoId: "2000000",
            rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
          },
          txlm: {
            memoId: "2000000",
            rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
          },
        },
        label: "Bob's Hot Wallet Address",
        addressType: "p2sh",
      },
      recoverable: true,
      tags: ["59cd72485007a239fb00282ed480da1f"],
      spendableBalanceString: "string",
      startDate: "string",
      type: "cold",
      users: [
        {
          user: "55e8a1a5df8380e0e30e20c6",
          permissions: ["admin", "view", "spend"],
        },
      ],
      customChangeKeySignatures: {
        user: "string",
        backup: "string",
        bitgo: "string",
      },
    };
  });

exports.releaseWalletReservedUnspent = jest
  .fn()
  .mockName("releaseWalletReservedUnspent")
  .mockImplementation(async (walletId, { id } = {}) => {
    return {
      unspents: [
        {
          id,
          walletId,
          expireTime: faker.date.future(),
          userId: "59cd72485007a239fb00282ed480da1f",
        },
      ],
    };
  });

exports.buildWalletTransaction = jest
  .fn()
  .mockName("buildWalletTransaction")
  .mockImplementation(async () => {
    return {
      keyDerivationPath: "string",
    };
  });

exports.initiateWalletTransaction = jest
  .fn()
  .mockName("initiateWalletTransaction")
  .mockImplementation(async (coin, walletId) => {
    return {
      id: walletId,
      coin,
      wallet: walletId,
      enterprise: walletId,
      keyId: walletId,
      creator: walletId,
      createDate: faker.date.recent(),
      info: {
        transactionRequest: {
          buildParams: {},
          coinSpecific: {},
          comment: "string",
          fee: "2000000",
          isUnsigned: true,
          recipients: [
            {
              address: "2MvrwRYBAuRtPTiZ5MyKg42Ke55W3fZJfZS",
              amount: "2000000",
              data: "string",
            },
          ],
          requestedAmount: "2000000",
          sourceWallet: walletId,
          triggeredPolicy: walletId,
          validTransaction: "string",
          validTransactionHash: "string",
        },
        type: "transactionRequest",
      },
      state: "pending",
      scope: "enterprise",
      userIds: [walletId],
      approvalsRequired: 1,
      walletLabel: "string",
    };
  });

exports.sendWalletHalfSignedTransaction = jest
  .fn()
  .mockName("sendWalletHalfSignedTransaction")
  .mockImplementation(async (coin, walletId, { comment, sequenceId } = {}) => {
    return {
      transfer: {
        coin,
        id: walletId,
        wallet: walletId,
        enterprise: walletId,
        txid: "b8a828b98dbf32d9fd1875cbace9640ceb8c82626716b4a64203fdc79bb46d26",
        height: 0,
        heightId: "string",
        date: "2021-06-29T12:00:37Z",
        type: "send",
        value: 0,
        valueString: "string",
        baseValue: 0,
        baseValueString: "string",
        feeString: "string",
        payGoFee: 0,
        payGoFeeString: "string",
        usd: 0,
        usdRate: 0,
        state: "confirmed",
        tags: [walletId],
        history: [
          {
            date: "2021-06-29T12:00:37Z",
            user: walletId,
            action: "created",
            comment: "comment",
          },
        ],
        comment,
        vSize: 0,
        nSegwitInputs: 0,
        coinSpecific: {},
        sequenceId,
        entries: [
          {
            address: "2NAUwNgXaoFj2VVnSEvNLGuez8CfdU2UCMZ",
            wallet: "string",
            value: 0,
            valueString: "string",
            isChange: true,
            isPayGo: true,
            token: "omg",
          },
        ],
        usersNotified: true,
      },
      txid: "string",
      tx: "string",
      status: "confirmed",
    };
  });

exports.initiateWalletTrustlineTransactionWallet = jest
  .fn()
  .mockName("initiateWalletTrustlineTransactionWallet")
  .mockImplementation(async (coin, walletId) => {
    return {
      id: walletId,
      coin,
      wallet: walletId,
      enterprise: walletId,
      keyId: walletId,
      creator: walletId,
      createDate: "2021-06-29T12:00:37Z",
      info: {
        transactionRequest: {
          buildParams: {},
          coinSpecific: {},
          comment: "string",
          fee: "2000000",
          isUnsigned: true,
          recipients: [
            {
              address: "2MvrwRYBAuRtPTiZ5MyKg42Ke55W3fZJfZS",
              amount: "2000000",
              data: "string",
            },
          ],
          requestedAmount: "2000000",
          sourceWallet: walletId,
          triggeredPolicy: walletId,
          validTransaction: "string",
          validTransactionHash: "string",
        },
        type: "transactionRequest",
      },
      state: "pending",
      scope: "enterprise",
      userIds: [walletId],
      approvalsRequired: 1,
      walletLabel: "string",
    };
  });

// ------------------------- Address -------------------------

exports.getAllWalletAddresses = jest
  .fn()
  .mockName("getAllWalletAddresses")
  .mockImplementation(async (coin, walletId) => {
    return {
      coin,
      totalAddressCount: 0,
      pendingAddressCount: 0,
      addresses: [
        {
          id: walletId,
          address: "2MvrwRYBAuRtPTiZ5MyKg42Ke55W3fZJfZS",
          chain: 1,
          index: 0,
          coin: "string",
          lastNonce: -1,
          wallet: walletId,
          coinSpecific: {
            xlm: {
              memoId: "2000000",
              rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
            },
            txlm: {
              memoId: "2000000",
              rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
            },
          },
          label: "Bob's Hot Wallet Address",
          addressType: "p2sh",
        },
      ],
      nextBatchPrevId: "585951a5df8380e0e3063e9f",
      count: 0,
    };
  });

exports.getWalletAddress = jest
  .fn()
  .mockName("getWalletAddress")
  .mockImplementation(async (coin, walletId, addressOrId) => {
    return {
      id: walletId,
      address: addressOrId,
      chain: 1,
      index: 0,
      coin: coin,
      lastNonce: -1,
      wallet: walletId,
      coinSpecific: {
        xlm: {
          memoId: "2000000",
          rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
        },
        txlm: {
          memoId: "2000000",
          rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
        },
      },
      label: "Bob's Hot Wallet Address",
      addressType: "p2sh",
      balance: {
        updated: "2021-06-29T12:00:36Z",
        balance: 0,
        totalReceived: 0,
        totalSent: 0,
      },
    };
  });

exports.updateWalletAddress = jest
  .fn()
  .mockName("updateWalletAddress")
  .mockImplementation(async (coin, walletId, addressOrId, { label } = {}) => {
    return {
      id: walletId,
      address: addressOrId,
      chain: 1,
      index: 0,
      coin: coin,
      lastNonce: -1,
      wallet: walletId,
      coinSpecific: {
        xlm: {
          memoId: "2000000",
          rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
        },
        txlm: {
          memoId: "2000000",
          rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
        },
      },
      label,
      addressType: "p2sh",
      balance: {
        updated: "2021-06-29T12:00:36Z",
        balance: 0,
        totalReceived: 0,
        totalSent: 0,
      },
    };
  });

exports.createWalletAddress = jest
  .fn()
  .mockName("createWalletAddress")
  .mockImplementation(async (coin, walletId, { chain, label } = {}) => {
    return {
      id: walletId,
      address: "2MvrwRYBAuRtPTiZ5MyKg42Ke55W3fZJfZS",
      chain,
      index: 0,
      coin,
      lastNonce: -1,
      wallet: walletId,
      coinSpecific: {
        xlm: {
          memoId: "2000000",
          rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
        },
        txlm: {
          memoId: "2000000",
          rootAddress: "GCTTCPH4IIDK7P72FFAEJ3ZFN6WDHJH6GGMRPHPM56ZWGIQ7B3XTIJAM",
        },
      },
      label,
      addressType: "p2sh",
    };
  });
