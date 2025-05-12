"use strict";

const objectHasOwnProperty = Object.prototype.hasOwnProperty;

/**
 *
 * @param {Object} object
 * @param {string} property
 * @returns {boolean}
 */
function hasOwnProperty(object, property) {
  return objectHasOwnProperty.call(object, property);
}

module.exports = hasOwnProperty;
