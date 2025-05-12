"use strict";

/* ------------------------- Utility ------------------------- */

/**
 *
 * @param {number} page
 * @param {number=} limit
 * @returns {number}
 */
function pageToSkip(page, limit = 10) {
  return (page - 1) * limit;
}

/* ------------------------- Exports ------------------------- */

module.exports = pageToSkip;
