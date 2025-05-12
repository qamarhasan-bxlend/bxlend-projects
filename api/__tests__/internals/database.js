"use strict";

const { MONGODB_URI } = require("@src/config");
const { uniq } = require("lodash");
const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(
    MONGODB_URI,
    {
      dbName: `database-${ process.env.JEST_WORKER_ID }`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  );
}

async function createDBCollections() {
  const dbCollections = await mongoose.connection.db.listCollections().toArray();

  const collections = uniq(Object.values(mongoose.models).map(model => model.collection.name))
    .filter(name => dbCollections.findIndex(collection => collection.name === name) === -1);

  await Promise.all(
    collections.map(async collection => mongoose.connection.createCollection(collection)),
  );
}

async function resetDB() {
  const collections = await mongoose.connection.db.listCollections().toArray();

  await Promise.all(
    collections.map(collection => mongoose.connection.collection(collection.name).deleteMany()),
  );
}

async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = {
  connectDB,
  createDBCollections,
  resetDB,
  disconnectDB,
};
