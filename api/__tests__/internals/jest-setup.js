"use strict";

const MONGOD = require("./jest-mongodb");
const REDISD = require("./jest-redis");
const { writeDBUri, writeRedisUri } = require("./jest-fs");

async function setup() {
  await MONGOD.start();

  await MONGOD.waitUntilRunning();

  await writeDBUri(await MONGOD.getUri());

  await REDISD.ensureInstance();

  await writeRedisUri(`redis://${ await REDISD.getHost() }:${ await REDISD.getPort() }`);
}

module.exports = setup;
