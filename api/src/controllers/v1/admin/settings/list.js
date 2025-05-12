"use strict";

const validate = require("@root/src/middlewares/validator");
const { Setting } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");


// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
  bodyParser.json(),
  validate({
    query: Joi
      .object()
      .keys({
        page: Joi
          .number()
          .integer()
          .min(1)
          .default(1),
        limit: Joi
          .number()
          .integer()
          .min(1)
          .max(100),
        select: Joi
          .array()
          .items(
            Joi
              .string()
              .valid(...Setting.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function listSettingsAdminV1Controller(req, res) {
    const {
      query: { page, limit },
    } = req;
    let {
      query: { select },
    } = req;

    const total_count = await Setting.countDocuments({
      deleted_at: {
        $exists: false,
      },
    }),
      toIncludeBefore = [],
      toExcludeAfter = [],
      toSkip = total_count > pageToSkip(page, limit) ? pageToSkip(page, limit) : 0,
      toLimit = total_count > toSkip ? limit : 0;
    let settings, page_count = 0;

    let query = Setting.find({
      deleted_at: {
        $exists: false,
      },
    })
      .select(union(select, toIncludeBefore))
      .skip(toSkip)
      .limit(toLimit);

    settings = await query;
    settings = settings.map((setting) => omit(setting.toJSON(), difference(toExcludeAfter, select)));

    res.json({
      settings,
      meta: {
        page,
        limit,
        page_count,
        total_count,
      },
    });

  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
