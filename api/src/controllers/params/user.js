"use strict";

const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");
const { User } = require("@src/models");
const { Types } = require("mongoose");

async function userParamController(req, res, next) {
  const id = req.params.user;

  if (id === "me") return next();

  if (!Types.ObjectId.isValid(id)) throw new NotFound(ERROR.USER_NOT_FOUND);

  const user = await User.findOne({
    _id: Types.ObjectId(id),
    deleted_at: { $exists: false },
  });

  if (user == null) throw new NotFound(ERROR.USER_NOT_FOUND);

  req.params.user = user;

  next();
}

module.exports = userParamController;
