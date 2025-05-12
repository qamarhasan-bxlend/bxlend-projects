"use strict";

const { KEY_DIRECTORY } = require("@src/constants");
const crypto = require("crypto");
const { loopWhile } = require("deasync");
const fs = require("fs");
const { fromKeyLike } = require("jose/jwk/from_key_like");
const path = require("path");

let jwks = [];

Promise
  .all([
    fromKeyLike(crypto.createPrivateKey(fs.readFileSync(path.resolve(KEY_DIRECTORY, "jwks-rsa.key")))),
  ])
  .then((result) => (jwks = result))
  .catch((error) => {
    console.error(error);

    process.exit(1);
  });

loopWhile(() => jwks.length === 0);

module.exports = jwks;
