"use strict";

const { Kyc, Country, User, Notification } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const {
  ERROR,
  STATUS_CODE,
  KYC_IDENTIFICATION_TYPE,
  S3_ACL,
  S3_UPLOAD_FOLDER,
  SUPPORTED_IMAGE_FORMATS,
  KYC_STATUS,
} = require("@src/constants");
const { S3 } = require("@src/lib");
const multer = require("multer")();
const { S3_ENDPOINT, S3_BUCKET } = require("@src/config");
const { Forbidden } = require("@src/errors");

// -----------------------------------------CONTROLLER---------------------------------------------------------

const CONTROLLER = [
  auth(),
  multer.array(S3_UPLOAD_FOLDER.KYC_DOCUMENT, 3),
  bodyParser.json(),
  validateKYC,
  createKycRequest,
];

const kycSchema = Joi.object().keys({
  name: Joi.object().keys({
    first: Joi.string().required(),
    middle: Joi.string(),
    last: Joi.string().required(),
  }).required(),
  country_code: Joi.string().required(),
  identification_type: Joi.string().valid(
    ...Object.values(KYC_IDENTIFICATION_TYPE)
  ).required(),
  terms_and_conditions_consent: Joi.boolean().invalid(false).required(),
  privacy_policy_consent: Joi.boolean().invalid(false).required(),
  address: Joi.object().keys({
    city: Joi.string().required(),
    pin_code: Joi.string().required(),
    full_address: Joi.string().required(),
  }).required(),
}).required();

async function createKycRequest(req, res) {
  const {
    user,
    body: {
      name,
      address,
      country_code,
      identification_type,
      terms_and_conditions_consent,
      privacy_policy_consent,
    },
  } = req;

  if(user.kyc_status == KYC_STATUS.VERIFIED){ 
    return res.status(201).send({message : "KYC already verified"})
  }
  else if(user.kyc_status == KYC_STATUS.PENDING){
    return res.status(201).send({message : "Your KYC is already in process"})
  }
  
  const folder = S3_UPLOAD_FOLDER.KYC_DOCUMENT,
    extension = SUPPORTED_IMAGE_FORMATS.JPEG;
  const metadata = { user: user.id };
  const country = await Country.findOne({ code: country_code });
  if (!country) throw new Forbidden(ERROR.COUNTRY_NOT_FOUND);
  if (req.files.length < 3) throw new Forbidden(ERROR.MISSING_ATTACHMENT);

  const uuids = (await Promise.all(req.files.map(async (file) => {
    const buffer = await S3.prepareForS3Upload(file.buffer);
    const filePath = await S3.upload(
      folder,
      extension,
      buffer,
      S3_ACL.PUBLIC,
      metadata
    );
    return `${S3_ENDPOINT}/${S3_BUCKET}/${filePath}`;
  }))).reverse();

  const [front, back, live_photo] = uuids;

  const query = await Kyc.findOneAndUpdate(
    { user: user.id },
    {
      email: user.email,
      name,
      address,
      country_code,
      identification_type,
      identification_url: { front, back },
      photo_url: live_photo,
      terms_and_conditions_consent,
      privacy_policy_consent,
      status: KYC_STATUS.PENDING,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  
  await User.updateOne({
    _id : user.id
  },{
    kyc_status : query.status,
    name
  });

  const kyc_request = await query;
  
  await Notification.create({
    user : user.id,
    message : 'Kyc has been submitted! You will be notified when it gets approved.',
    title : 'KYC'
  })

  res.status(kyc_request ? STATUS_CODE.OK : STATUS_CODE.NOT_FOUND).json({ query });
}

function validateKYC(req, res, next) {
  const { error } = kycSchema.validate(req.body);
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