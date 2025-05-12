"use strict";

const { PresaleUser } = require("@src/models");

// ------------------------- Service -------------------------

/**
 *
 * @param {{
 *   user: Object,
 * }} input
 * @param {import("@src/utils/DBTransaction").DBTransaction=} DBT
 * @returns {Promise<Object>}
 */
async function showPresaleUser(input, DBT) {
  const { user } = input;

  return await PresaleUser.findOne({
    user_id: user._id,
  }).session(DBT?.session);
}

// ------------------------- Exports -------------------------

module.exports = showPresaleUser;
