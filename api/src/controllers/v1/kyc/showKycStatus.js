"use strict";

const validate = require("@root/src/middlewares/validator");
const { Kyc } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...Kyc.getSelectableFields()))
        .default([]),
    }),
  }),
  async function showKycStatus(req, res) {
    const {
      user,
      query: { select },
    } = req;

    const toExcludeAfter = [
      "user",
      "name",
      "identification_url",
      "country_code",
      "identification_type",
      "photo_url",
      "privacy_policy_consent",
      "terms_and_conditions_consent",
      "created_at",
      "updated_at",
    ];

    let kyc;

    let query = Kyc.findOne({
      user: user.id,
      deleted_at: {
        $exists: false,
      },
    });

    kyc = await query;
    if (!kyc) return res.json({ kyc: null });

    kyc = omit(kyc.toJSON(), difference(toExcludeAfter, select));

    res.json({ kyc });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------
