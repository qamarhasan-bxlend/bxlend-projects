"use strict";

const { Forbidden } = require("@src/errors");
const { Joi, OpenIDConnect, Mailgun, HCaptcha } = require("@src/lib");
const { validate } = require("@src/middlewares");
const { User } = require("@src/models");
const { EmailVerification } = require("@src/models");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const { v4: uuidV4 } = require("uuid");
const { KYC_STATUS } = require('@src/constants')
const { generateUniqueReferralCode } = require('@src/utils')
const { authenticator } = require('otplib');
const { WEBSITE_CLIENT_URI } = require('@src/config')
const prefix = "/auth";

const CONTROLLER = [
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi
      .object()
      .keys({
        login: Joi
          .string()
          .email()
          .required(),
        password: Joi
          .string()
          .required(),
        password_confirm: Joi
          .string()
          .required(),
        "g-recaptcha-response": Joi.string().optional().allow("").messages({
          'any.required': "Captcha is required",
        }),
        "h-captcha-response": Joi.string().optional().allow("").messages({
          'any.required': "Captcha is required"
        })
      })
      .required(),
  }),
  async function registerInteraction(req, res) {
    const { prompt: { name }, uid, params } = await OpenIDConnect.interactionDetails(req, res);
    const secret = authenticator.generateSecret();
    const { login, password, password_confirm } = req.body;
    const captchaResponse = await HCaptcha.verifyHCaptcha(req.body["g-captcha-response"] || req.body["h-captcha-response"]);
    const response_json = captchaResponse?.data
    const success = response_json?.success
    if (!success) {
      return res.render("screens/register", {
        error: "Invalid captcha response. Please try again.",
        prefix,
        uid,
        params,
        login, // to pre-fill the email for user convenience
        client_uri: WEBSITE_CLIENT_URI
      });
    }
    if (name !== "login") throw new Error(`Unexpected Prompt: ${name}`);

    if (password !== password_confirm) throw new Error(`Passwords don't match`)
    try {
      const userExists = await User.countDocuments({ email: login }); // TODO: deleted accounts

      if (userExists > 0) throw new Error('User already Exist')
      const referral_code = await generateUniqueReferralCode();
      const user = await User.create({
        email: login,
        password: bcrypt.hashSync(password, 10),
        kyc_status: KYC_STATUS.UNVERIFIED,
        secret: secret,
        bxlend_id: referral_code
      });

      const result = {
        login: {
          accountId: user.id,
        },
      };

      // Sending email to newly created user
      const verification = new EmailVerification({
        user: user._id,
        input: login,
        token: uuidV4(),
        platform_id: 34345
      });

      await Mailgun.sendVerificationEmail(user, verification);
      await verification.save();

      await OpenIDConnect.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (error) {
      console.log(error)
      return res.render("screens/register", {
        error: error.message,
        prefix,
        uid,
        params,
        login, // to pre-fill the email for user convenience
        client_uri: WEBSITE_CLIENT_URI
      });
    }
  }
];

module.exports = CONTROLLER;
