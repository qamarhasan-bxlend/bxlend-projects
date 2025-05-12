"use strict";

const { STORAGE_URI } = require("@src/config");

/**
 *
 * @param {string} path
 * @returns {string}
 */
function generateAssetUri(path) {
  return `${ STORAGE_URI }/${ path }`;
}

module.exports = generateAssetUri;
