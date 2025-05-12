"use strict";

const { STATUS_MESSAGE, AUTH_SCOPE } = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { auth } = require("@src/middlewares");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth([AUTH_SCOPE.REMOVE_USER]),
  async function removeUserV1Controller(req, res) {
    const { user, params: { user: userParam } } = req;

    if (!user._id.equals(userParam._id)) throw new Forbidden();

    userParam.deleted_at = new Date();

    await userParam.save();

    res.json({ message: STATUS_MESSAGE.OK });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/users/{user_id}:
 *   delete:
 *     tags:
 *       - User
 *     description: Deactivate user account by id
 *     security:
 *       - OpenID Connect:
 *         - remove:user
 *     parameters:
 *       - $ref: "#/parameters/user_id_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: User account has been deactivate successfully
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
