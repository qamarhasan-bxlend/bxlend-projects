"use strict";

const {
  STATUS_MESSAGE,
  VERIFICATION_STATUS,
  AUTH_SCOPE,
  STATUS_CODE
} = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { Twilio, Joi } = require("@src/lib");
const { otpGenerator } = require("@src/utils");
const { auth, validate } = require("@src/middlewares");
const { PhoneNumberVerification } = require("@src/models");
const bodyParser = require("body-parser");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth([AUTH_SCOPE.WRITE_USER_PHONE_NUMBER]),
  bodyParser.json(),
  validate({
    body: Joi
      .object()
      .keys({
        phone_number: Joi.object()
          .keys({
            code: Joi.string().required(),
            number: Joi.string().required(),
          }),
      })
      .required(),
  }),
  async function resendUserPhoneNumberVerificationCodeV1Controller(req, res) {
    const { user, params: { user: userParam }, body: { phone_number } } = req;

    if (!user._id.equals(userParam._id)) throw new Forbidden();
    const ph_num =
    (phone_number.code.startsWith("+")
      ? phone_number.code
      : `+${phone_number.code}`) + phone_number.number;

    // if (userParam.phone_number_verified_at != null) {
    //   return res.status(STATUS_CODE.FORBIDDEN).json({
    //     message: "phone number already verified",
    //     error: "phone number already verified"
    //   })
    // }

    const activeVerification = await PhoneNumberVerification.findOne({
      user: userParam._id,
      status: { $in: [VERIFICATION_STATUS.PENDING, VERIFICATION_STATUS.DELIVERED] },
      deleted_at: { $exists: false },
      input: ph_num
    }).sort({created_at : -1});
    if (!activeVerification) {
      return res.status(STATUS_CODE.CONFLICT).json({
        message: "phone number already verified or no active verification process for this number. Start from the begining",
        error: "phone number already verified or no active verification process for this number. Start from the begining",
      })

    }
    //generate OTP
    const otp = otpGenerator()
    const resp = await Twilio.sendPhoneVerificationOtp(ph_num, otp)
    if (resp?.status) {
      // await PhoneNumberVerification.create({
      //   user: userParam._id,
      //   input: phone_number,
      //   platform_id: resp.response.sid,
      //   code: otp
      // });
      activeVerification.code = otp
      await activeVerification.save()
    } else {
      console.log(resp)
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: `could not send OTP ; ${resp?.response}`,
        error: `could not send OTP ; ${resp?.response}`
      })
    }

    // if (activeVerification != null) {
    //   await Vonage.cancelVerificationRequest(activeVerification);

    //   activeVerification.status = VERIFICATION_STATUS.CANCELED;

    //   await activeVerification.save();
    // }

    // const vonagePlatformId = await Vonage.sendVerificationCode(userParam);

    // await PhoneNumberVerification.create({
    //   user: userParam._id,
    //   input: userParam.phone_number,
    //   platform_id: vonagePlatformId,
    // });

    res.json({ message: STATUS_MESSAGE.OK });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/users/{user_id}/phone-number/verification/resend:
 *   post:
 *     tags:
 *       - User
 *       - Verification
 *     description: Resend user phone number verification code
 *     security:
 *       - OpenID Connect:
 *         - write:user.phone_number
 *     parameters:
 *       - $ref: "#/parameters/user_id_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: User phone number verification code has been resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OK"
 *       401:
 *         $ref: "#/responses/401"
 *       403:
 *         $ref: "#/responses/403"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */
