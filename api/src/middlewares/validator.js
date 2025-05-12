"use strict";

const { STATUS_CODE, ERROR } = require("@src/constants");

/**
 *
 * @param {Object[]} details
 * @returns {Object}
 */
function serialize(details) {
  return details.reduce((acc, cur) => {
    const key = cur.path.join(".");

    if (!acc[key]) acc[key] = [];

    acc[key].push(cur.message);

    return acc;
  }, {});
}

/**
 *
 * @param {{ body: import("joi")=, query: import("joi")= }}schema
 * @returns {(function(*, *, *): (*|undefined))|*}
 */
function validate(schema = {}) {
  const { body, query } = schema;

  return function validator(req, res, next) {
    if (body) {
      const { error, value } = body.label("body").validate(req.body, { abortEarly: false });

      if (error != null) {
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
          error: ERROR.UNPROCESSABLE_ENTITY,
          details: serialize(error.details),
        });
      }

      req.body = value;
    }

    if (query) {
      const { error, value } = query.label("query").validate(req.query, { abortEarly: false });

      if (error != null) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({
          error: ERROR.BAD_REQUEST,
          details: serialize(error.details),
        });
      }

      req.query = value;
    }

    next();
  };
}

module.exports = validate;
