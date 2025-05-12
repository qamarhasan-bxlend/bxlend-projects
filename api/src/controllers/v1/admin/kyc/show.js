"use strict";

const validate = require("@root/src/middlewares/validator");
const { Kyc } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { ERROR } = require("@src/constants");
const { NotFound } = require("@src/errors");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
  bodyParser.json(),
  validate({
    params: Joi.object()
      .keys({
        kyc_id: Joi.string().required(),
      })
      .required(),
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...Kyc.getSelectableFields()))
        .default([]),
    }),
  }),
  async function showKycAdminV1Controller(req, res) {
    const {
      params: { kyc_id },
      query: { select },
    } = req;

    const toExcludeAfter = [];
    let kyc;

    let query = Kyc.findOne({
      _id: kyc_id,
      deleted_at: {
        $exists: false,
      },
    });

    kyc = await query;
    if(!kyc) throw new NotFound(ERROR.KYC_NOT_FOUND);
    kyc = omit(kyc.toJSON(), difference(toExcludeAfter, select));

    res.json({ kyc });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------