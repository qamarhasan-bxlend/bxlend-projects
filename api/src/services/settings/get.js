"use strict";

const SETTINGS = require("./SETTINGS");

// ------------------------- Service -------------------------

/**
 * Get setting value.
 *
 * @param {string} name
 * @param {*=} fallback
 * @return {*}
 */
function getSetting(name, fallback = null) {
  return SETTINGS[name] ?? fallback;
}

// ------------------------- Exports -------------------------

module.exports = getSetting;
