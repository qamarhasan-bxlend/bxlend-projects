"use strict";

const { Setting } = require("@src/models");
const SETTINGS = require("./SETTINGS");

// ------------------------- Service -------------------------

/**
 * Set setting value.
 *
 * @param {string} name
 * @param {*} value
 * @return {Promise<*>}
 */
async function setSetting(name, value) {
  await Setting.updateOne(
    { name },
    {
      $set: { value },
      $setOnInsert: { name },
    },
    { upsert: true },
  );

  SETTINGS[name] = value;

  return value;
}

// ------------------------- Exports -------------------------

module.exports = setSetting;
