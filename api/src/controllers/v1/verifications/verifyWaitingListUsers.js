"use strict";

const { WEBSITE_URI } = require("@src/config");
const {
  STATUS_CODE,
  VERIFICATION_STATUS, WAITING_LIST_STATUS
} = require("@src/constants");
const { Forbidden } = require("@src/errors");
const { WaitingListUsersVerification, WaitingListUser } = require("@src/models");
const { DBTransaction } = require("@src/utils");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  async function verifyWaitingListUsersV1Controller(req, res) {
    const { params: { token } } = req;

    const verification = await WaitingListUsersVerification
      .findOne({
        token,
        // status: { $in: [VERIFICATION_STATUS.PENDING, VERIFICATION_STATUS.DELIVERED] },
        deleted_at: { $exists: false },
      })
      .populate("user");

    if (verification == null) throw new Forbidden();
    if (verification.status == VERIFICATION_STATUS.VERIFIED) res.status(409).send('Email Already Verified')
    if (verification.status == VERIFICATION_STATUS.CANCELED) res.status(401).send('Token Canceled. Resubmit the registration form.')
    

    const DBT = await DBTransaction.init();

    try {
      verification.status = VERIFICATION_STATUS.VERIFIED;

      await verification.save(DBT.mongoose());

      const user = await WaitingListUser.updateOne({ email: verification.input }, {
        $set: {
          status: WAITING_LIST_STATUS.VERIFIED
        }
      })

      await DBT.commit();
    } catch (error) {
      await DBT.abort();
      throw error;
    }

    res.status(STATUS_CODE.OK).json({ message: "Email Address has been verified" });
  },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/verifications/waiting-list-users/verify/{token}:
 *   get:
 *     tags:
 *       - User
 *       - Verification
 *     description: Verify waiting-list users by verification token
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
