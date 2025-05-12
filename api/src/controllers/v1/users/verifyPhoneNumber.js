"use strict";

const {
  STATUS_MESSAGE,
  VERIFICATION_STATUS,
  VONAGE_VERIFICATION_CODE_LENGTH,
  AUTH_SCOPE,
  STATUS_CODE
} = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { Joi, Vonage } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const { PhoneNumberVerification } = require("@src/models");
const { DBTransaction } = require("@src/utils");
const bodyParser = require("body-parser");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth([AUTH_SCOPE.WRITE_USER_PHONE_NUMBER]),
  bodyParser.json(),
  validate({
    body: Joi
      .object()
      .keys({
        code: Joi
          .string()
          .required(),
        phone_number: Joi.object()
          .keys({
            code: Joi.string().required(),
            number: Joi.string().required(),
          }),
      })
      .required(),
  }),
  async function verifyUserPhoneNumberV1Controller(req, res) {

    const { user, params: { user: userParam }, body: { code } } = req;
    const { phone_number } = req.body
    if (!user._id.equals(userParam._id)) throw new Forbidden();
    const ph_num =
      (phone_number.code.startsWith("+")
        ? phone_number.code
        : `+${phone_number.code}`) + phone_number.number;


    const verification = await PhoneNumberVerification.findOne({
      user: userParam._id,
      status: { $in: [VERIFICATION_STATUS.PENDING, VERIFICATION_STATUS.DELIVERED] },
      deleted_at: { $exists: false },
      code: code,
      input: ph_num
    });

    if (!verification) {
      return res.status(STATUS_CODE.FORBIDDEN).json({
        message: "invalid or expired otp",
        error: "invalid or expired otp",
      })
    }
    const updatePreviousVerifications = await PhoneNumberVerification.updateMany({
      _id: { $ne: verification._id },
      user: userParam._id,
    },{
      status : VERIFICATION_STATUS.CANCELED
    })

    const DBT = await DBTransaction.init();

    try {
      verification.status = VERIFICATION_STATUS.VERIFIED;

      await verification.save(DBT.mongoose());

      userParam.phone_number_verified_at = verification.updated_at;
      userParam.phone_number = phone_number

      await userParam.save(DBT.mongoose());

      await DBT.commit();
    } catch (error) {
      await DBT.abort();

      throw error;
    }

    res.json({ message: STATUS_MESSAGE.OK });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/users/{user_id}/phone-number/verify:
 *   post:
 *     tags:
 *       - User
 *       - Verification
 *     description: Verify user phone number by id
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
 *               - code
 *             properties:
 *               code:
 *                 description: Phone number verification code
 *                 type: string
 *                 format: numeric
 *                 example: "123456"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: User phone number has been verified successfully
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
