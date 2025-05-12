"use strict";

/* ------------------------- Utility ------------------------- */

/**
 *
 * @param {string[]} fields
 * @returns {string}
 */
function prepareMongoDBSelect(fields) {
  if (!fields.includes("id")) fields = fields.concat(["-_id"]);

  return fields
    .map(field => field === "id" ? "_id" : field)
    .join(" ");
}

/* ------------------------- Exports ------------------------- */

module.exports = prepareMongoDBSelect;
