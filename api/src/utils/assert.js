/* eslint-disable no-useless-escape */
"use strict";

const regex = {
  bitgoAccessToken: /([a-z][0-9])\w+/,
  cryptoapisApiKey: /([a-z][0-9])\w+/,
  vaultodyApiKey: /([a-z][0-9])\w+/,
  uri: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
  numeric: /^[0-9]+(\.[0-9]+)?$/,
  uuid: /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/,
  objectId : /^[0-9a-fA-F]{24}$/
};


exports.isBitgoAccessToken = input => regex.bitgoAccessToken.test(input);
exports.iscryptoapisApiKey = input => regex.cryptoapisApiKey.test(input);
exports.isVaultodyApiKey = input => regex.vaultodyApiKey.test(input);
exports.isUri = input => regex.uri.test(input);
exports.isNumeric = input => regex.numeric.test(input);
exports.isUuid = input => regex.uuid.test(input);
exports.isObjectId = input =>regex.objectId.test(input);