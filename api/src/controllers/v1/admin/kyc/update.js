"use strict";

const validate = require("@root/src/middlewares/validator");
const { Kyc, Notification } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { omit, difference } = require("lodash");
const { DBTransaction } = require("@src/utils");
const { Forbidden } = require("@src/errors");
const { STATUS_CODE, KYC_STATUS } = require("@src/constants");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
  bodyParser.json(),
  validate({
    body: Joi.object()
      .keys({
        status: Joi.string().valid(...Object.values(KYC_STATUS)),
        response_message: Joi.string().allow(''),
      }),
    query: Joi.object().keys({
      select: Joi.array()
        .items(Joi.string().valid(...Kyc.getSelectableFields()))
        .default([]),
    }),
  }),
  async function updateKycAdminV1Controller(req, res) {
    const {
      params: { kyc_id },
      query: { select },
      body,
    } = req;
    const { status } = body

    let kyc = await Kyc
      .findOne({
        _id: kyc_id,
        deleted_at: { $exists: false },
      })
      .populate("user");
    if (!kyc)
      throw new Error("KYC not found. Please reload the page.");
    if (kyc &&
      kyc.status === KYC_STATUS.VERIFIED &&
      status === 'VERIFIED') {
      throw new Error("KYC already verified. Press cancel button and reload.");
    }
    else if (kyc && kyc.status == KYC_STATUS.CANCELED && status === KYC_STATUS.CANCELED)
      throw new Error("KYC already canceled. Press cancel button and reload.");

    const user = kyc.user;

    const DBT = await DBTransaction.init();

    try {
      kyc.status = body.status;
      kyc.response_message = body.response_message;

      await kyc.save(DBT.mongoose());

      user.kyc_status = body.status;

      await user.save(DBT.mongoose());
      await Notification.create({
        user: user.id,
        message: 'Your KYC has been approved! Enjoy deposits, withdrawals, and many more features.',
        title: 'KYC'
      });

      await DBT.commit();
    } catch (error) {
      await DBT.abort();

      throw error;
    }

    const toExcludeAfter = [];
    let query = Kyc.findOne({
      _id: kyc_id,
      deleted_at: {
        $exists: false,
      },
    });

    kyc = await query;
    kyc = omit(kyc.toJSON(), difference(toExcludeAfter, select));

    res.status(kyc ? STATUS_CODE.OK : STATUS_CODE.NOT_FOUND).json({ kyc });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------