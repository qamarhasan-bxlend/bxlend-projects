"use strict";

/* istanbul ignore file */

const { VONAGE_API_KEY, VONAGE_API_SECRET, VONAGE_APPLICATION_ID } = require("@src/config");
const { BRAND, VONAGE_COMMAND, VONAGE_VERIFICATION_CODE_LENGTH, VONAGE_FUNCTIONS } = require("@src/constants");
const {
  VonageBlacklistError,
  VonageConcurrentError,
  VonageError,
  VonageNetworkSupportError,
  VonageThrottleError,
} = require("@src/errors");
const Vonage = require("@vonage/server-sdk");

// ------------------------- Library -------------------------

const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET,
  applicationId: VONAGE_APPLICATION_ID,
});

/**
 * Send 2FA code to provided user's phone number
 *
 * @param {import("mongoose").Document} user
 * @returns {Promise<string>}
 */
function sendVerificationCode(user) {
  return promisify(
    VONAGE_FUNCTIONS.START,
    {
      number: user.phone_number,
      brand: BRAND,
      code_length: VONAGE_VERIFICATION_CODE_LENGTH,
      // country: user.country, TODO: lookinto it
      // lg: user.language?.toLowerCase(), TODO: lookinto it
      // pin_expiry: "", // TODO: read from settings (DB)
      // next_event_wait: "", // TODO: read from settings (DB)
    },
    (result) => result.request_id,
  );
}

/**
 * Get 2FA verification details
 *
 * @param {import("mongoose").Document} verification
 * @returns {Promise<Object>}
 */
function getVerificationInfo(verification) {
  return promisify(
    VONAGE_FUNCTIONS.SEARCH,
    {
      request_id: verification.platform_id,
    },
  );
}

/**
 * Check if the 2FA code is correct
 *
 * @param {import("mongoose").Document} verification
 * @param {string} code
 * @returns {Promise<boolean>}
 */
function checkVerificationCode(verification, code) {
  return promisify(
    VONAGE_FUNCTIONS.CHECK,
    {
      request_id: verification.platform_id,
      code,
    },
    (result) => result.status === 0,
  );
}

/**
 * Cancel 2FA verification request
 *
 * @param {import("mongoose").Document} verification
 * @returns {Promise<void>}
 */
function cancelVerificationRequest(verification) {
  return promisify(
    VONAGE_FUNCTIONS.CONTROL,
    {
      request_id: verification.platform_id,
      cmd: VONAGE_COMMAND.CANCEL,
    },
    () => void 0,
  );
}

// ------------------------- Exports -------------------------

module.exports = {
  sendVerificationCode,
  getVerificationInfo,
  checkVerificationCode,
  cancelVerificationRequest,
};

// ------------------------- Helpers -------------------------

/**
 *
 * @param {function} fn
 * @param {Object} data
 * @param {(function(object): *)=} resultSerializer
 * @returns {Promise<*>}
 */
function promisify(fn, data, resultSerializer = (result) => result) {
  return new Promise((resolve, reject) => vonage.verify[fn](
    data,
    (error, result) => {
      if (error != null) return reject(error);

      switch (result.status) {
        default:
        case 0:
          resolve(resultSerializer(result));
          break;
        case 1:
          reject(new VonageThrottleError(result.error_text));
          break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 8:
        case 9:
        case 20:
        case 29:
        case 101:
          reject(new VonageError(result.error_text));
          break;
        case 7:
          reject(new VonageBlacklistError(result.error_text));
          break;
        case 10:
          reject(new VonageConcurrentError(result.error_text));
          break;
        case 15:
          reject(new VonageNetworkSupportError(result.error_text));
          break;
      }
    },
  ));
}
