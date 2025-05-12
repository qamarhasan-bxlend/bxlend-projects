"use strict";

const catchError = require("./catchError");

/**
 *
 * @param {function(...*): Promise<*>} fn
 * @return {function(...*): Promise<*>}
 */
function wrapAsyncFn(fn) {
  return (...args) => fn(...args).catch(catchError);
}

module.exports = wrapAsyncFn;
