"use strict";

const { STATUS_CODE, AUTH_SCOPE } = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { Joi } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const { Notification } = require('@src/models')

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth([AUTH_SCOPE.WRITE_USER_PASSWORD]),
  bodyParser.json(),
  validate({
    body: Joi
      .object()
      .keys({
        old_password: Joi
          .string()
          .required(),
        new_password: Joi
          .string()
          .required(),
      })
      .required(),
  }),
  async function updateUserPasswordV1Controller(req, res) {
    try {
      let { user, params: { user: userParam }, body: { old_password, new_password } } = req;

      if (!user._id.equals(userParam._id))
        throw new Forbidden();

      if (! await bcrypt.compare(old_password, userParam.password))
        throw new Forbidden('Incorrect Old Password');

      if (await bcrypt.compare(new_password, userParam.password))
        throw new Error('New Password is same as Old Password');

      const hashedNewPassword = await bcrypt.hash(new_password, 10);
      userParam.password = hashedNewPassword;
      await userParam.save();

      await Notification.create(
        {
          user: user._id,
          title: 'Password Reset',
          message: 'Your Password was reset!',
        })

      res.json({ message: 'Password Changed' });
    } catch (error) {
      if (error instanceof Forbidden) {
        res.status(STATUS_CODE.FORBIDDEN).json({ error: error.message });
      } else {
        res.status(STATUS_CODE.BAD_REQUEST).json({ error: error.message });
      }
    }
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/users/{user_id}/password:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update user password by id
 *     description: |
 *                  Updates user password by id
 *     security:
 *       - OpenID Connect:
 *         - write:user.password
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
 *               - old_password
 *               - new_password
 *             properties:
 *               old_password:
 *                 description: "User's current password"
 *                 type: string
 *                 format: password
 *                 example: "0ld-p@$$w0rd"
 *               new_password:
 *                 description: "User's new password"
 *                 type: string
 *                 format: password
 *                 example: "p@$$w0rd"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: User password has been updated successfully
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
