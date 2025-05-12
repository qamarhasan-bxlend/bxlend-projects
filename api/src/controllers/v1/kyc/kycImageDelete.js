"use strict";

const validate = require("@root/src/middlewares/validator");
const { auth } = require("@src/middlewares");
const { ERROR, STATUS_CODE, S3_UPLOAD_FOLDER, KYC_STATUS } = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { S3, Joi } = require("@src/lib");
const { Kyc } = require("@src/models");
const bodyParser = require("body-parser");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    body: Joi.object().keys({
      image_url: Joi.string().uri().required(),
    }).required(),
  }),
  async function kycImageDelete(req, res) {
    const {
      user
    } = req;

    const {
      image_url
    } = req.body;

    const image_ids = image_url.split('/');
    const image_id = image_ids[image_ids.length-1]
    const folder = S3_UPLOAD_FOLDER.KYC_DOCUMENT;
    
    const metadata = await S3.retrieveObjectMetadata(folder, image_id);
    if(user.id != metadata.Metadata.user) throw new Forbidden(ERROR.UNAUTHORIZED);

    await S3.deleteS3Image(folder, image_id);

    res.status(STATUS_CODE.OK).json({ message: "Image deleted successfully" });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------