"use strict";

const { AUTH_SCOPE, USER_GENDER } = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { Joi } = require("@src/lib");
const { auth, validate } = require("@src/middlewares");
const bodyParser = require("body-parser");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth([AUTH_SCOPE.WRITE_USER_PROFILE]),
  bodyParser.json(),
  validate({
    body: Joi
      .object()
      .keys({
        user: Joi
          .object()
          .keys({
            name: Joi
              .object()
              .keys({
                first: Joi
                  .string()
                  .min(3),
                last: Joi
                  .string()
                  .min(3),
              })
              .min(1),
            birthdate: Joi
              .date()
              .iso()
              .less("now"), // TODO: read minimum age limit from DB
            gender: Joi
              .string()
              .valid(...Object.values(USER_GENDER)),
            country: Joi
              .string(), // TODO: check enum with DB?
            language: Joi
              .string()
              .valid("en-US"), // TODO: check enum with DB?
          })
          .min(1)
          .required(),
      })
      .required(),
  }),
  async function updateUserV1Controller(req, res) {
    const { user, token, params: { user: userParam }, body: { user: data } } = req;

    if (!user._id.equals(userParam._id)) throw new Forbidden();

    if (data.name != null) {
      if (userParam.name == null) userParam.name = {};

      if (data.name.first != null) userParam.name.first = data.name.first;

      if (data.name.last != null) userParam.name.last = data.name.last;
    }

    if (data.birthdate != null) userParam.birthdate = data.birthdate;

    if (data.gender != null) userParam.gender = data.gender;

    if (data.country != null) userParam.country = data.country;

    if (data.language != null) userParam.language = data.language;

    await userParam.save();

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
 *   patch:
 *     tags:
 *       - User
 *     description: Update user profile by id
 *     security:
 *       - OpenID Connect:
 *         - write:user.profile
 *       - OpenID Connect:
 *         - write:user.profile
 *         - read:user.profile
 *       - OpenID Connect:
 *         - write:user.profile
 *         - read:user.email
 *       - OpenID Connect:
 *         - write:user.profile
 *         - read:user.phone_number
 *       - OpenID Connect:
 *         - write:user.profile
 *         - read:user.profile
 *         - read:user.email
 *       - OpenID Connect:
 *         - write:user.profile
 *         - read:user.profile
 *         - read:user.phone_number
 *       - OpenID Connect:
 *         - write:user.profile
 *         - read:user.email
 *         - read:user.phone_number
 *       - OpenID Connect:
 *         - write:user.profile
 *         - read:user.profile
 *         - read:user.email
 *         - read:user.phone_number
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
 *               - user
 *             properties:
 *               user:
 *                 $ref: "#/definitions/User"
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
 *       422:
 *         $ref: "#/responses/422"
 *       500:
 *         $ref: "#/responses/500"
 */
