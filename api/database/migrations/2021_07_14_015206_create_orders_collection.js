"use strict";

const { COLLECTION: NAME, DISCRIMINATOR } = require("@src/constants");
const { connection: { db } } = require("mongoose");

// ------------------------- COLLECTION -------------------------

const COLLECTION_NAME = NAME.ORDER;

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
          pair_symbol: 1,
          direction: 1,
          status: 1,
          limit_price: 1,
          created_at: 1,
        },
      },
    ],
    DBT.mongoose(),
  );
};

exports.down = async function down() {
  const collections = await db.listCollections().toArray();

  if (collections.findIndex(collection => collection.name === COLLECTION_NAME) === -1) return;

  await COLLECTION.drop();
};
