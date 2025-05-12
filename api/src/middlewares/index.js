"use strict";

exports.auth = require("./auth");
exports.validate = require("./validator");
exports.adminAuth = require("./adminAuth");
exports.kycAuth = require('./kycAuth')
exports.emailAuth = require('./emailAuth')
exports.twoFAAuth = require('./twoFAAuth')
exports.verifyTwoFACode = require("./verifyTwoFACode")