"use strict";

const { Forbidden } = require("@src/errors");
const { Joi, OpenIDConnect, HCaptcha } = require("@src/lib");
const { validate } = require("@src/middlewares");
const { User } = require("@src/models");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const prefix = "/auth";
const { WEBSITE_CLIENT_URI, API_URI, API_PORT } = require('@src/config')


const CONTROLLER = [
  bodyParser.urlencoded({ extended: true }),
  validate({
    body: Joi
      .object()
      .keys({
        login: Joi
          .string()
          .required(),
        password: Joi
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
  async function loginInteraction(req, res) {
    const { prompt: { name }, uid, params } = await OpenIDConnect.interactionDetails(req, res);
    const { login, password } = req.body;
    const client_uri = API_URI == `http://localhost:${API_PORT}` ? WEBSITE_CLIENT_URI : `https://${WEBSITE_CLIENT_URI}`

    const captchaResponse = await HCaptcha.verifyHCaptcha(req.body["g-captcha-response"] || req.body["h-captcha-response"]);
    const response_json = captchaResponse?.data
    const success = response_json?.success
    if (!success) {
      return res.render("screens/login", {
        error: "Invalid captcha response. Please try again.",
        prefix,
        uid,
        params,
        login, // to pre-fill the email for user convenience
        client_uri: client_uri
      });
    }
      if (name !== "login") throw new Error(`Unexpected Prompt: ${name}`);

      try {
        const user = await User.findOne({
          email: login,
          deleted_at: { $exists: false },
        });

        if (user == null || !bcrypt.compareSync(password, user.password)) {
          // Here, instead of redirecting or throwing an error, we render the login screen with an error message.
          throw new Error("Invalid email or password. Please try again.")
        }

        const result = {
          login: {
            accountId: user.id,
          },
        };

        await OpenIDConnect.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
      } catch (error) {
        return res.render("screens/login", {
          error: error.message,
          prefix,
          uid,
          params,
          login, // to pre-fill the email for user convenience
          client_uri: client_uri
        });
      }
    },
];


module.exports = CONTROLLER;
