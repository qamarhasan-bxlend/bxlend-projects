"use strict";

const {
  STATUS_MESSAGE,
  VERIFICATION_STATUS,
  AUTH_SCOPE,
  STATUS_CODE
} = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { Joi, Vonage, Twilio } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const { PhoneNumberVerification, User } = require("@src/models");
const { DBTransaction, otpGenerator } = require("@src/utils");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth([AUTH_SCOPE.WRITE_USER_PHONE_NUMBER]),
  bodyParser.json(),
  validate({
    body: Joi.object().keys({
      phone_number: Joi.object()
        .keys({
          code: Joi.string().required(),
          number: Joi.string().required(),
        }),
      password: Joi
        .string()
        .required(),
    })
      .required(),
  }),
  async function updateUserPhoneNumberV1Controller(req, res) {
    const { user, params: { user: userParam }, body: { phone_number, password } } = req;
    /**
   * Algorithm 
   * step 1 : check authentic user
   * step 2 : check if number is already taken and verified by some other user
   * step 3 : check if this phone number is already attached with current user
   * step 4 : send code using twilio and save it in DB
   */
    if (!user._id.equals(userParam._id) || !bcrypt.compareSync(password, userParam.password)) {
      return res.status(STATUS_CODE.FORBIDDEN).json({
        message: "incorrect password",
        error: "incorrect password"
      })
    }
    const ph_num =
      (phone_number.code.startsWith("+")
        ? phone_number.code
        : `+${phone_number.code}`) + phone_number.number;

    console.log("🚀 ~ updateUserPhoneNumberV1Controller ~ ph_num:", ph_num)

    const isPhoneNumberTaken = await User.findOne({
      "phone_number.number": phone_number.number,
      "phone_number.code": phone_number.code,
      _id: { $ne: user._id },
      phone_number_verified_at: { $ne: null },
    })
    console.log("🚀 ~ updateUserPhoneNumberV1Controller ~ isPhoneNumberTaken:", isPhoneNumberTaken)

    if (isPhoneNumberTaken) {
      return res.status(STATUS_CODE.FORBIDDEN).json({
        message: "phone number already in use",
        error: "phone number already in use",
      })
    }
    const activeVerifiedVerification = await PhoneNumberVerification.findOne({
      user: userParam._id,
      status: { $in: [VERIFICATION_STATUS.VERIFIED] },
      deleted_at: { $exists: false },
      input: ph_num
    });
    if (activeVerifiedVerification) {
      return res.status(STATUS_CODE.CONFLICT).json({
        message: "phone number already verified with your account",
        error: "phone number already verified with your account",
      })
    }

    const DBT = await DBTransaction.init();

    try {
      // userParam.phone_number = phone_number;
      // userParam.phone_number_verified_at = null;
      // await userParam.save();

      //generate OTP
      const otp = otpGenerator()
      const resp = await Twilio.sendPhoneVerificationOtp(ph_num, otp)
      if (resp?.status) {
        await PhoneNumberVerification.create({
          user: userParam._id,
          input: ph_num,
          platform_id: resp.response.sid,
          code: otp
        });
      } else {
        console.log(resp)
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          message: `could not send OTP`,
          error: `could not send OTP`,
          err_object: resp.response
        })
      }
      await DBT.commit();
    } catch (error) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: error.message ?? error,
        error: error.message ?? error
      });
      await DBT.abort();

      throw error;
    }

    return res.json({ message: STATUS_MESSAGE.OK });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/users/{user_id}/phone-number:
 *   patch:
 *     tags:
 *       - User
 *       - Verification
 *     summary: Update user phone number by id
 *     description: |
 *                  Updates user phone number by id and send verification code<br>
 *                  If user had already verified a phone number, it's now changed to unverified status with the new phone number
 *     security:
 *       - OpenID Connect:
 *         - write:user.phone_number
 *     parameters:
 *       - $ref: "#/parameters/user_id_parameter"
 *     consumes:
 *      - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - password
 *             properties:
 *               phone_number:
 *                 description: "User's phone number"
 *                 type: string
 *                 format: phone_number
 *                 example: "+12133734253"
 *               password:
 *                 description: "User's password"
 *                 type: string
 *                 format: password
 *                 example: "p@$$w0rd"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: User phone number has been updated successfully
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
 *       422:
 *         $ref: "#/responses/422"
 *       500:
 *         $ref: "#/responses/500"
 */
