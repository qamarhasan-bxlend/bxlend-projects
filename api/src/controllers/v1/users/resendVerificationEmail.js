"use strict";

const {
  STATUS_MESSAGE,
  STATUS_CODE,
  VERIFICATION_STATUS,
  AUTH_SCOPE,
} = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { Mailgun } = require("@src/lib");
const { auth } = require("@src/middlewares");
const { EmailVerification } = require("@src/models");
const { v4: uuidV4 } = require("uuid");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth([AUTH_SCOPE.WRITE_USER_EMAIL]),
  async function resendVerificationEmailV1Controller(req, res) {
    try {
      const { user, params: { user: userParam } } = req;

      if (!user._id.equals(userParam._id)) throw new Forbidden();

      if (userParam.email_verified_at != null) return res.status(STATUS_CODE.BAD_REQUEST).json({ error: 'email already verified' });

      const activeVerification = await EmailVerification.findOne({
        user: userParam._id,
        status: { $in: [VERIFICATION_STATUS.PENDING, VERIFICATION_STATUS.DELIVERED] },
        deleted_at: { $exists: false },
      });

      if (activeVerification != null) {
        activeVerification.status = VERIFICATION_STATUS.CANCELED;

        await activeVerification.save();
      }

      const verification = new EmailVerification({
        user: userParam._id,
        input: userParam.email,
        token: uuidV4(),
      });

      verification.platform_id = await Mailgun.sendVerificationEmail(userParam, verification);
      await verification.save();

      res.status(STATUS_CODE.OK).json({ message: "A new code has been sent to your email address" });
    }
    catch (error) {
      console.log(error)
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        error: "Could not send mail. Please contact customer support"
      })
    }
  }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/users/{user_id}/email/verification/resend:
 *   post:
 *     tags:
 *       - User
 *       - Verification
 *     description: Resend user verification email
 *     security:
 *       - OpenID Connect:
 *         - write:user.email
 *     parameters:
 *       - $ref: "#/parameters/user_id_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: User verification email has been resent successfully
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
