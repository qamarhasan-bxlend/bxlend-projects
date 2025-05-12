"use strict";

const { MongoMemoryReplSet } = require("mongodb-memory-server");

const MONGOD = new MongoMemoryReplSet({
  autoStart: false,
  binary: {
    version: "6.0.6",
  },
  replSet: {
    count: 1,
    storageEngine: "wiredTiger",
  },
});

module.exports = MONGOD;
