"use strict";

const validate = require("@root/src/middlewares/validator");
const { User } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { KYC_STATUS, DURATION } = require('@src/constants')
const { kycDashboardFilter, userAndTransactionDashboardFilter } = require('../filter')


// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
  bodyParser.json(),
  validate({
    body: Joi
      .object()
      .keys({
        duration: Joi
          .string()
          .valid(...Object.values(DURATION))
          .default(DURATION.MONTHLY)
      }),
    query: Joi
      .object()
      .keys({
        page: Joi
          .number()
          .integer()
          .min(1),
        limit: Joi
          .number()
          .integer()
          .min(1),
        select: Joi
          .array()
          .items(
            Joi
              .string()
              .valid(...User.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function listUsersDashboardAdminV1Controller(req, res) {
    const { duration } = req.body;
    let StatusCounts = [
      { "_id": KYC_STATUS.VERIFIED, "count": 0 },
      { "_id": KYC_STATUS.PENDING, "count": 0 },
      { "_id": KYC_STATUS.EXPIRED, "count": 0 },
      { "_id": KYC_STATUS.CANCELED, "count": 0 },
      { "_id": KYC_STATUS.FAILED, "count": 0 },
      { "_id": KYC_STATUS.UNVERIFIED, "count": 0 },
    ]
    const match = {
      deleted_at: { $exists: false },
    };
    const model_count = await kycDashboardFilter(duration, match, User, StatusCounts)

    const total_count = await User.countDocuments({
      deleted_at: {
        $exists: false,
      },
    });

    res.json({
      total_count: total_count,
      user_count: model_count
    })
  }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;