"use strict";

const MONGOD = require("./jest-mongodb");
const REDISD = require("./jest-redis");
const { pruneDBUri, pruneRedisUri } = require("./jest-fs");

async function teardown() {
  await pruneDBUri();
  await pruneRedisUri();

  await MONGOD.stop();

  await MONGOD.cleanup(true);

  await REDISD.stop();
}

module.exports = teardown;
