"use strict";

const { existsSync, readFileSync } = require("fs");
const { writeFile, rm } = require("fs/promises");
const path = require("path");

const DB_CONFIG_PATH = path.resolve(process.cwd(), ".jest-mongodb");
const REDIS_CONFIG_PATH = path.resolve(process.cwd(), ".jest-redis");

const ENCODING = "utf8";

async function writeDBUri(uri) {
  await writeFile(
    DB_CONFIG_PATH,
    uri,
    ENCODING,
  );
}

function readDBUri() {
  if (!existsSync(DB_CONFIG_PATH)) throw new Error(".jest-mongodb file not found");

  return readFileSync(
    DB_CONFIG_PATH,
    ENCODING,
  );
}

async function pruneDBUri() {
  await rm(DB_CONFIG_PATH);
}

async function writeRedisUri(uri) {
  await writeFile(
    REDIS_CONFIG_PATH,
    uri,
    ENCODING,
  );
}

function readRedisUri() {
  if (!existsSync(REDIS_CONFIG_PATH)) throw new Error(".jest-redis file not found");

  return readFileSync(
    REDIS_CONFIG_PATH,
    ENCODING,
  );
}

async function pruneRedisUri() {
  await rm(REDIS_CONFIG_PATH);
}

module.exports = {
  writeDBUri,
  readDBUri,
  pruneDBUri,
  writeRedisUri,
  readRedisUri,
  pruneRedisUri,
};
