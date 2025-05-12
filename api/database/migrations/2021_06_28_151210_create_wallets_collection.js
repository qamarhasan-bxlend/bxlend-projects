"use strict";

const { COLLECTION: NAME } = require("@src/constants");
const { connection: { db } } = require("mongoose");

// ------------------------- COLLECTION -------------------------

const COLLECTION_NAME = NAME.WALLET;

const COLLECTION = db.collection(COLLECTION_NAME);

// ------------------------- Commands ---------------------------

/**
 *
 * @param {import("@src/utils/DBTransaction")} DBT
 * @returns {Promise<void>}
 */
exports.up = async function up(DBT) {
  await db.createCollection(COLLECTION_NAME, DBT.mongoose());

  await COLLECTION.createIndexes(
    [
      {
        key: {
          kind: 1,
          owner_type: 1,
          owner: 1,
          currency_code: 1,
        },
        partialFilterExpression: {
          owner_type: { $exists: true },
        },
        unique: true,
      },
      {
        key: {
          kind: 1,
          currency_code: 1,
        },
        partialFilterExpression: {
          kind: "INTERNAL",
        },
        unique: true,
      },
    ],
    DBT.mongoose(),
  );

  // TODO: create BitGo internal wallets
};

exports.down = async function down() {
  const collections = await db.listCollections().toArray();

  if (collections.findIndex(collection => collection.name === COLLECTION_NAME) === -1) return;

  await COLLECTION.drop();
};
