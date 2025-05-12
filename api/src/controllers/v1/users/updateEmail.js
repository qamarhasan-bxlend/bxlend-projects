"use strict";

const {
  STATUS_MESSAGE,
  VERIFICATION_STATUS,
  AUTH_SCOPE,
} = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { Joi, Mailgun } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const { EmailVerification } = require("@src/models");
const { DBTransaction } = require("@src/utils");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const { v4: uuidV4 } = require("uuid");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth([AUTH_SCOPE.WRITE_USER_EMAIL]),
  bodyParser.json(),
  validate({
    body: Joi
      .object()
      .keys({
        email: Joi
          .string()
          .email()
          .required(),
        password: Joi
          .string()
          .required(),
      })
      .required(),
  }),
  async function updateUserEmailV1Controller(req, res) {
    const { user, params: { user: userParam }, body: { email, password } } = req;

    if (
      !user._id.equals(userParam._id)
      || !bcrypt.compareSync(password, userParam.password)
    ) throw new Forbidden();

    if (userParam.email === email) return res.json({ message: STATUS_MESSAGE.OK });

    const activeVerification = await EmailVerification.findOne({
      user: userParam._id,
      status: { $in: [VERIFICATION_STATUS.PENDING, VERIFICATION_STATUS.DELIVERED] },
      deleted_at: { $exists: false },
    });

    if (activeVerification != null) {
      activeVerification.status = VERIFICATION_STATUS.CANCELED;

      await activeVerification.save();
    }

    const DBT = await DBTransaction.init();

    try {
      userParam.email = email;
      userParam.email_verified_at = null;

      await userParam.save(DBT.mongoose());

      const verification = new EmailVerification({
        user: userParam._id,
        input: email,
        token: uuidV4(),
      });

      verification.platform_id = await Mailgun.sendVerificationEmail(userParam, verification);

      await verification.save(DBT.mongoose());

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
 * /v1/users/{user_id}/email:
 *   patch:
 *     tags:
 *       - User
 *       - Verification
 *     summary: Update user email by id
 *     description: |
 *                  Updates user email by id and send verification email<br>
 *                  If user had already verified a email, it's now changed to unverified status with the new email
 *     security:
 *       - OpenID Connect:
 *         - write:user.email
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
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 description: "User's email address"
 *                 type: string
 *                 format: email
 *                 example: "email@example.com"
 *               password:
 *                 description: "User's password"
 *                 type: string
 *                 format: password
 *                 example: "p@$$w0rd"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: User email has been updated successfully
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
