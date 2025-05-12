"use strict";

/**
 * Wrap controllers to insure all the possible sync/async errors are caught properly
 *
 * @param {function|function[]} controller
 * @returns {(function(*=, *=, *=): void)|*}
 */
function wrapController(controller) {
  if (Array.isArray(controller)) return controller.map(wrapController);

  return function wrappedController(req, res, next) {
    try {
      const result = controller(req, res, next);

      if (result instanceof Promise) {
        result.catch(error => next(error));
      }
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  wrapController,
};
