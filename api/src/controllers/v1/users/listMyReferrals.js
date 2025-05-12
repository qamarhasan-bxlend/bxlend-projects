"use strict";

const { User } = require("@src/models");
const { auth } = require("@src/middlewares");

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    async function showMyreferralsV1Controller(req, res) {
        try {
            const { user } = req;
            let myReferrals = [];
            if (user?.bxlend_id) {
                myReferrals = await User.find({ referred_by: user.bxlend_id }).select('email -_id').lean();
            }
            return res.status(200).json({ myReferrals });
        } catch (error) {
            console.log("🚀 ~ showMyreferralsV1Controller ~ error:", error)
            return res.status(500).json({ error: error.message, message: 'Internal server error' });
        }
    },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/users/referral:
 *   get:
 *     tags:
 *       - User
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
