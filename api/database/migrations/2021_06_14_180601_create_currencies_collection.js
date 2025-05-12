"use strict";

const { COLLECTION: NAME, DISCRIMINATOR, CURRENCY_KIND, CURRENCY_NETWORK, S3_ACL } = require("@src/constants");
const S3 = require("@src/lib/S3");
const { connection: { db } } = require("mongoose");

// ------------------------- CONSTANTS --------------------------

const FIAT_CURRENCIES = [
  {
    code: "HKD",
    name: "Hong Kong Dollar",
    display_decimals: 2,
    symbol: "HK$",
    country_code: "HK",
  },
];

const CRYPTO_CURRENCIES = [
  {
    code: "BTC",
    name: "Bitcoin",
    display_decimals: 8,
    decimals: 8,
    icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" shape-rendering=\"geometricPrecision\" text-rendering=\"geometricPrecision\" image-rendering=\"optimizeQuality\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" viewBox=\"0 0 4091.27 4091.73\"><g fill-rule=\"nonzero\"><path fill=\"#F7931A\" d=\"M4030.06 2540.77C3756.82 3636.78 2646.74 4303.79 1550.6 4030.48 454.92 3757.24-212.09 2647.09 61.27 1551.17c273.12-1096.13 1383.2-1763.19 2479-1489.95C3636.33 334.46 4303.3 1444.73 4030.03 2540.79l.02-.02z\"/><path fill=\"#fff\" d=\"M2947.77 1754.38c40.72-272.26-166.56-418.61-450-516.24l91.95-368.8-224.5-55.94-89.51 359.09c-59.02-14.72-119.63-28.59-179.87-42.34L2186 768.69l-224.36-55.94-92 368.68c-48.84-11.12-96.81-22.11-143.35-33.69l.26-1.16-309.59-77.31-59.72 239.78s166.56 38.18 163.05 40.53c90.91 22.69 107.35 82.87 104.62 130.57l-104.74 420.15c6.26 1.59 14.38 3.89 23.34 7.49-7.49-1.86-15.46-3.89-23.73-5.87l-146.81 588.57c-11.11 27.62-39.31 69.07-102.87 53.33 2.25 3.26-163.17-40.72-163.17-40.72l-111.46 256.98 292.15 72.83c54.35 13.63 107.61 27.89 160.06 41.3l-92.9 373.03 224.24 55.94 92-369.07c61.26 16.63 120.71 31.97 178.91 46.43l-91.69 367.33 224.51 55.94 92.89-372.33c382.82 72.45 670.67 43.24 791.83-303.02 97.63-278.78-4.86-439.58-206.26-544.44 146.69-33.83 257.18-130.31 286.64-329.61l-.07-.05zm-512.93 719.26c-69.38 278.78-538.76 128.08-690.94 90.29l123.28-494.2c152.17 37.99 640.17 113.17 567.67 403.91zm69.43-723.3c-63.29 253.58-453.96 124.75-580.69 93.16l111.77-448.21c126.73 31.59 534.85 90.55 468.94 355.05h-.02z\"/></g></svg>",
    website: "https://bitcoin.org",
    networks: [CURRENCY_NETWORK.BTC],
  },
  {
    code: "ETH",
    name: "Ethereum",
    display_decimals: 18,
    decimals: 18,
    icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" shape-rendering=\"geometricPrecision\" text-rendering=\"geometricPrecision\" image-rendering=\"optimizeQuality\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" viewBox=\"0 0 784.37 1277.39\"><g fill-rule=\"nonzero\"><path fill=\"#343434\" d=\"M392.07 0l-8.57 29.11v844.63l8.57 8.55 392.06-231.75z\"/><path fill=\"#8C8C8C\" d=\"M392.07 0L0 650.54l392.07 231.75V472.33z\"/><path fill=\"#3C3C3B\" d=\"M392.07 956.52l-4.83 5.89v300.87l4.83 14.1 392.3-552.49z\"/><path fill=\"#8C8C8C\" d=\"M392.07 1277.38V956.52L0 724.89z\"/><path fill=\"#141414\" d=\"M392.07 882.29l392.06-231.75-392.06-178.21z\"/><path fill=\"#393939\" d=\"M0 650.54l392.07 231.75V472.33z\"/></g></svg>",
    website: "https://ethereum.org",
    networks: [CURRENCY_NETWORK.ERC20],
  },
  {
    code: "USDT",
    name: "Tether",
    display_decimals: 6,
    decimals: 6,
    icon: "<svg data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 339.43 295.27\"><path d=\"M62.15 1.45l-61.89 130a2.52 2.52 0 00.54 2.94l167.15 160.17a2.55 2.55 0 003.53 0L338.63 134.4a2.52 2.52 0 00.54-2.94l-61.89-130A2.5 2.5 0 00275 0H64.45a2.5 2.5 0 00-2.3 1.45z\" fill=\"#50af95\" fill-rule=\"evenodd\"/><path d=\"M191.19 144.8c-1.2.09-7.4.46-21.23.46-11 0-18.81-.33-21.55-.46-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25 74.24-18.15v28.91c2.78.2 10.74.67 21.74.67 13.2 0 19.81-.55 21-.66v-28.9c42.42 1.89 74.08 9.29 74.08 18.13s-31.65 16.24-74.08 18.12zm0-39.25V79.68h59.2V40.23H89.21v39.45h59.19v25.86c-48.11 2.21-84.29 11.74-84.29 23.16s36.18 20.94 84.29 23.16v82.9h42.78v-82.93c48-2.21 84.12-11.73 84.12-23.14s-36.09-20.93-84.12-23.15zm0 0z\" fill=\"#fff\" fill-rule=\"evenodd\"/></svg>",
    website: "https://tether.to",
    networks: [CURRENCY_NETWORK.ERC20],
  },
];

// ------------------------- COLLECTION -------------------------

const COLLECTION_NAME = NAME.CURRENCY;

const COLLECTION = db.collection(COLLECTION_NAME);

// ------------------------- Commands ---------------------------

/**
 *
 * @param {import("@src/utils/DBTransaction").DBTransaction} DBT
 * @returns {Promise<void>}
 */
exports.up = async function up(DBT) {
  await db.createCollection(COLLECTION_NAME, DBT.mongoose());

  await COLLECTION.createIndexes(
    [
      {
        key: {
          [DISCRIMINATOR]: 1,
        },
      },
      {
        key: {
          code: 1,
        },
        unique: true,
      },
      {
        key: {
          country_code: 1,
        },
        partialFilterExpression: {
          [DISCRIMINATOR]: CURRENCY_KIND.FIAT,
        },
      },
      {
        key: {
          networks: 1,
        },
        partialFilterExpression: {
          [DISCRIMINATOR]: CURRENCY_KIND.CRYPTO,
        },
      },
    ],
    DBT.mongoose(),
  );

  const now = new Date();

  let currencies = FIAT_CURRENCIES.map(currency => ({
    kind: CURRENCY_KIND.FIAT,
    ...currency,
    created_at: now,
    updated_at: now,
  }));

  for (const currency of CRYPTO_CURRENCIES) {
    currency.icon = await S3.upload("icons", "svg", currency.icon, S3_ACL.PUBLIC);
  }

  currencies = currencies.concat(
    CRYPTO_CURRENCIES.map(currency => ({
      kind: CURRENCY_KIND.CRYPTO,
      ...currency,
      created_at: now,
      updated_at: now,
    })),
  );

  await COLLECTION.insertMany(
    currencies,
    {
      ordered: true,
      session: DBT.session,
    },
  );
};

exports.down = async function down() {
  const collections = await db.listCollections().toArray();

  if (collections.findIndex(collection => collection.name === COLLECTION_NAME) === -1) return;

  await COLLECTION.drop();
};
