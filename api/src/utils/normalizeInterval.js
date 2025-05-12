"use strict";

const alphaPartToSeconds = {
  m: 60,
  H: 60 * 60,
  D: 60 * 60 * 24,
};

/**
 *
 * @param {string} interval
 * @returns {number}
 */
function normalizeInterval(interval) {
  const alphaPart = interval[interval.length - 1];
  const numbericPart = interval.slice(0, interval.length - 1);

  return parseInt(numbericPart) * alphaPartToSeconds[alphaPart];
}

module.exports = normalizeInterval;
