"use strict";

const { Country, WaitingListUser, WaitingListUsersVerification } = require("@src/models");
const { Joi, Mailgun } = require("@src/lib");
const bodyParser = require("body-parser");
const { v4: uuidV4 } = require("uuid");
const {
  ERROR,
  STATUS_CODE,
  WAITING_LIST_IDENTIFICATION_TYPE,
  S3_ACL,
  S3_UPLOAD_FOLDER,
  SUPPORTED_IMAGE_FORMATS,
  WAITING_LIST_STATUS,
  VERIFICATION_STATUS,
} = require("@src/constants");
const { S3 } = require("@src/lib");
const multer = require("multer")();
const { S3_ENDPOINT, S3_BUCKET } = require("@src/config");
const { Forbidden } = require("@src/errors");
const { DBTransaction } = require("@src/utils");
const validate = require("@root/src/middlewares/validator");

// -----------------------------------------CONTROLLER---------------------------------------------------------

const CONTROLLER = [
  multer.array(S3_UPLOAD_FOLDER.WAITING_LIST_USER_DOCUMENT, 3),
  bodyParser.json(),
  validate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.object().keys({
        first: Joi.string().required(),
        middle: Joi.string(),
        last: Joi.string().required(),
      }).required(),
      country_code: Joi.string().required(),
      identification_type: Joi.string().valid(
        ...Object.values(WAITING_LIST_IDENTIFICATION_TYPE)
      ),
      terms_and_conditions_consent: Joi.boolean().invalid(false).required(),
      privacy_policy_consent: Joi.boolean().invalid(false).required(),
      address: Joi.object().keys({
        city: Joi.string().required(),
        pin_code: Joi.string().required(),
        full_address: Joi.string().required(),
      }).required(),
    }).required()
  }),
  createWaitingListRegisteration,
];

const waitlingListUserSchema = validate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    name: Joi.object().keys({
      first: Joi.string().required(),
      middle: Joi.string(),
      last: Joi.string().required(),
    }).required(),
    country_code: Joi.string().required(),
    terms_and_conditions_consent: Joi.boolean().invalid(false).required(),
    privacy_policy_consent: Joi.boolean().invalid(false).required(),
    address: Joi.object().keys({
      city: Joi.string().required(),
      pin_code: Joi.string().required(),
      full_address: Joi.string().required(),
    }).required(),
  }).required()
});

async function createWaitingListRegisteration(req, res) {
  let {
    body: {
      name,
      email,
      address,
      country_code,
      terms_and_conditions_consent,
      privacy_policy_consent,
    },
  } = req;
  const token = uuidV4()
  const exist = await WaitingListUser.findOne({ email })
  if (exist && exist.status === "PENDING") {
    console.log('exist')

    const isVerificationExist = await WaitingListUsersVerification
      .findOneAndDelete({
        user: exist._id,
        status: { $in: [VERIFICATION_STATUS.PENDING, VERIFICATION_STATUS.DELIVERED, VERIFICATION_STATUS.CANCELED] },
        deleted_at: { $exists: false },
      })
      .populate("user");

    const verification = await WaitingListUsersVerification.create({
      user: exist._id,
      token: token,
      input: email
    });
    const mailRes = await Mailgun.sendWaitingListUsersVerificationEmail(email, token)
    verification.platform_id = mailRes
    await verification.save()

    return res.status(STATUS_CODE.OK).send({ msg: 'Already Submitted. Verification Mail has been sent again' });
  }
  else if (exist && exist.status === "VERIFIED") throw new Forbidden('User Already Registered')

  const folder = S3_UPLOAD_FOLDER.WAITING_LIST_USER_DOCUMENT,
    extension = SUPPORTED_IMAGE_FORMATS.JPEG;
  const country = await Country.findOne({ code: country_code });
  if (!country) throw new Forbidden(ERROR.COUNTRY_NOT_FOUND);
  // if (req.files.length < 3) throw new Forbidden(ERROR.MISSING_ATTACHMENT);
  const DBT = await DBTransaction.init();
  let front, back, live_photo;
  try {
    if (req.files.length > 0) {
      const uuids = (await Promise.all(req.files.map(async (file) => {
        const buffer = await S3.prepareForS3Upload(file.buffer);
        const filePath = await S3.upload(
          folder,
          extension,
          buffer,
          S3_ACL.PUBLIC,
        );
        return `${S3_ENDPOINT}/${S3_BUCKET}/${filePath}`;
      }))).reverse();

      [front, back, live_photo] = uuids;
    }
    const user = {
      email: email
    }
    let identification_type

    if (req.body.identification_type)
      identification_type = req.body.identification_type

    if ((!(front || back || live_photo) && identification_type)) {
      throw new Forbidden('Choose document type only if you are uploading the documents.')
    }
    const query = await WaitingListUser.create(
      [{
        email,
        name,
        address,
        country_code,
        identification_type: identification_type,
        identification_url: { front, back },
        photo_url: live_photo,
        terms_and_conditions_consent,
        privacy_policy_consent,
        status: WAITING_LIST_STATUS.PENDING,
      }],
      DBT.mongoose()
    );
    const isVerificationExist = await WaitingListUsersVerification
      .findOneAndDelete({
        user: query[0]._id,
        status: { $in: [VERIFICATION_STATUS.PENDING, VERIFICATION_STATUS.DELIVERED, VERIFICATION_STATUS.CANCELED] },
        deleted_at: { $exists: false },
      })
      .populate("user");

    const verification = await WaitingListUsersVerification.create([{
      user: query[0]._id,
      token: token,
      input: query[0].email
    }], DBT.mongoose());
    await DBT.commit()

    const outerDBT = await DBTransaction.init()
    const mailRes = await Mailgun.sendWaitingListUsersVerificationEmail(email, token)


    verification[0].platform_id = mailRes
    await verification[0].save(outerDBT.mongoose())
    await outerDBT.commit()

    res.status(query[0] ? STATUS_CODE.OK : STATUS_CODE.SERVICE_UNAVAILABLE).json({ msg: 'Verification mail has been sent' });
  }
  catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

function validateWaitingListUser(req, res, next) {
  const { error } = waitlingListUserSchema.validate(req.body);
  if (error) {
    return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
      error: "unprocessable-entity",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
}
// -----------------------------------------EXPORTS---------------------------------------------------------
module.exports = CONTROLLER;