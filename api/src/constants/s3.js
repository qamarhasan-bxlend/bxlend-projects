"use strict";

const S3_ACL = {
  PRIVATE: "private",
  PUBLIC: "public-read",
};

const S3_UPLOAD_FOLDER = {
  MANUAL_TRANSACTIONS: "manual_transactions",
  KYC_DOCUMENT: "kyc_document",
  WAITING_LIST_USER_DOCUMENT: "waiting_list_user_document",
  PRESALE_TRANSACTION : "presale_transaction"
};

const S3_MAX_IMAGE_SIZE = 3 * 1024 * 1024 + 1; // 3 megabytes

const SUPPORTED_IMAGE_FORMATS = {
  JPEG: "jpeg",
  PNG: "png",
  WEBP: "webp",
  TIFF: "tiff",
  GIF: "gif",
  SVG: "svg",
};

module.exports = {
  S3_ACL,
  S3_UPLOAD_FOLDER,
  S3_MAX_IMAGE_SIZE,
  SUPPORTED_IMAGE_FORMATS,
};
