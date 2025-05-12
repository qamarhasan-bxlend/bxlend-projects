"use strict";

const { AUTH_SCOPE } = require("@src/constants");
const { User } = require("@src/models");
const { Forbidden } = require("@src/errors");
const { auth } = require("@src/middlewares");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  async function showUserV1Controller(req, res) {
    const { user, token, params: { user: userParam } } = req;
    if(!user._id.equals(userParam._id)) throw new Forbidden();

    res.json({ user: userParam.serialize(token) });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/users/{user_id}:
 *   get:
 *     tags:
 *       - User
 *     description: Get user account by id
 *     security:
 *       - OpenID Connect:
 *         - read:user.profile
 *       - OpenID Connect:
 *         - read:user.email
 *       - OpenID Connect:
 *         - read:user.phone_number
 *       - OpenID Connect:
 *         - read:user.profile
 *         - read:user.email
 *       - OpenID Connect:
 *         - read:user.profile
 *         - read:user.phone_number
 *       - OpenID Connect:
 *         - read:user.email
 *         - read:user.phone_number
 *       - OpenID Connect:
 *         - read:user.profile
 *         - read:user.email
 *         - read:user.phone_number
 *     parameters:
 *       - $ref: "#/parameters/user_id_parameter"
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: The requested user account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - user
 *               properties:
 *                 user:
 *                   $ref: "#/definitions/User"
 *       401:
 *         $ref: "#/responses/401"
 *       403:
 *         $ref: "#/responses/403"
 *       404:
 *         $ref: "#/responses/404"
 *       500:
 *         $ref: "#/responses/500"
 */
