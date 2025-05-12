"use strict";

const validate = require("@root/src/middlewares/validator");
const { Joi } = require("@src/lib");
const { Kyc } = require("@src/models");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { pageToSkip, search } = require("@src/utils/index");
const { omit, union, difference } = require("lodash");
const { MODEL: NAME,STATUS_CODE } = require("@src/constants");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
  bodyParser.json(),
  validate({
    query: Joi
      .object()
      .keys({
        field: Joi
          .string(),
        value: Joi
          .string(),
        page: Joi
          .number()
          .integer()
          .min(1)
          .default(1),
        limit: Joi
          .number()
          .integer()
          .min(1)
          .max(100)
          .default(10),
        select: Joi
          .array()
          .items(
            Joi
              .string()
              .valid(...Kyc.getSelectableFields()),
          )
          .default([]),
      }),
  }),
  async function listKycRequestsAdminV1Controller(req, res) {
   try{
    const {
      query: { page, limit, field, value },
    } = req;
    let {
      query: { select },
    } = req;

    let output
    output = search(field, value)

    const total_count = await Kyc.countDocuments(output),
      toBePopulated = [
        {
          path: "user",
          select: "-created_at -updated_at -password",
          model: NAME.USER,
        },
      ],
      toIncludeBefore = [],
      toExcludeAfter = [],
      toSkip = pageToSkip(page, limit),
      toLimit = limit,
      page_count = +Math.ceil(total_count / limit),
      meta = {
        page,
        limit,
        page_count,
        total_count,
      };

    let kycs = [];
    let query = Kyc.find(output)
      .select(union(select, toIncludeBefore))
      .skip(toSkip)
      .limit(toLimit)
      .sort({ 'created_at': -1 })

    toBePopulated.forEach(populate => {
      if (select.length && select.includes(populate.path)) {
        query.populate(populate);
      } else if (!select.length) {
        query.populate(populate);
      }
    });

    kycs = await query;
    kycs = kycs
      .map((kyc) => omit(kyc.toJSON(), difference(toExcludeAfter, select)))
      .map((kyc) => {
        kyc.user_id = kyc.user.id;
        return kyc;
      });

    res.json({
      kyc: kycs,
      meta,
    });
   }
   catch(error){
    console.log('error',error)
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message : error?.message,
      error : error?.message,
    })
   }
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------