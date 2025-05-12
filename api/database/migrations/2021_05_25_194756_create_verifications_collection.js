"use strict";

const { COLLECTION: NAME } = require("@src/constants");
const { connection: { db } } = require("mongoose");

// ------------------------- COLLECTION -------------------------

const COLLECTION_NAME = NAME.VERIFICATION;

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
          kind: 1,
          user: 1,
          status: 1,
          deleted_at: 1,
        },
      },
      {
        key: {
          kind: 1,
          token: 1,
          status: 1,
          deleted_at: 1,
        },
        partialFilterExpression: {
          token: { $exists: true },
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
