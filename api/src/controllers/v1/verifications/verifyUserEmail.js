"use strict";

const { WEBSITE_URI,WEBSITE_CLIENT_URI,API_URI } = require("@src/config");
const {
  STATUS_CODE,
  VERIFICATION_STATUS,
} = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { EmailVerification } = require("@src/models");
const { DBTransaction } = require("@src/utils");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  async function verifyUserEmailV1Controller(req, res) {
    const { params: { token } } = req;

    const verification = await EmailVerification
      .findOne({
        token,
        status: { $in: [VERIFICATION_STATUS.PENDING, VERIFICATION_STATUS.DELIVERED] },
        deleted_at: { $exists: false },
      })
      .populate("user");

    if (verification == null) {
      return res
        .status(STATUS_CODE.CONFLICT) // Set the HTTP status code
        .redirect(`${WEBSITE_CLIENT_URI}/account-created`);
    }
    const prefix = API_URI == "http://localhost:3001" ? "" : "https://";
    const user = verification.user;

    const DBT = await DBTransaction.init();

    try {
      verification.status = VERIFICATION_STATUS.VERIFIED;

      await verification.save(DBT.mongoose());

      user.email_verified_at = verification.updated_at;

      await user.save(DBT.mongoose());

      await DBT.commit();
    } catch (error) {
      await DBT.abort();

      throw error;
    }

    return res
      .status(STATUS_CODE.OK)
      .redirect(`${prefix}${WEBSITE_CLIENT_URI}/account-created`);
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/verifications/email/verify/{token}:
 *   get:
 *     tags:
 *       - User
 *       - Verification
 *     description: Verify user email by verification token
 *     security: []
 *     parameters:
 *       - description: "The verification token"
 *         in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           example: "a1b2c3d-a1b2c3d-a1b2c3d-a1b2c3d"
 *     responses:
 *       302:
 *         $ref: "#/responses/302"
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
