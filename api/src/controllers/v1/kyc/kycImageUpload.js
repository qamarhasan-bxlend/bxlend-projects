"use strict";

const { auth } = require("@src/middlewares");
const multer = require("multer")();
const {
  ERROR,
  S3_ACL,
  STATUS_CODE,
  S3_UPLOAD_FOLDER,
  SUPPORTED_IMAGE_FORMATS,
} = require("@src/constants");
const { S3_ENDPOINT, S3_BUCKET } = require("@src/config");
const { Forbidden } = require("@src/errors");
const { S3 } = require("@src/lib");
const { v4: uuidV4 } = require("uuid");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  multer.array(S3_UPLOAD_FOLDER.KYC_DOCUMENT, 1),
  async function kycImageUpload(req, res) {
    const { user } = req;

    const folder = S3_UPLOAD_FOLDER.KYC_DOCUMENT,
      extension = SUPPORTED_IMAGE_FORMATS.JPEG;

    if (!req.files) throw new Forbidden(ERROR.MISSING_ATTACHMENT);

    const metadata = {
      user: user.id,
    };

    const uuids = [];
    for (const file of req.files) {
      const buffer = await S3.prepareForS3Upload(file.buffer);
      const filePath = await S3.upload(
        folder,
        extension,
        buffer,
        S3_ACL.PUBLIC,
        metadata
      );
      const uuid = `${S3_ENDPOINT}/${S3_BUCKET}/${filePath}`
      // console.log(uuid)
      uuids.push(uuid);
    }

    res
      .status(uuids ? STATUS_CODE.OK : STATUS_CODE.NOT_FOUND)
      .json({ attachments: uuids });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------
