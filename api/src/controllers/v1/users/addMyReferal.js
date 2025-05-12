"use strict";

const { User } = require("@src/models");
const { auth, validate } = require("@src/middlewares");
const { Joi } = require("@src/lib");
const bodyParser = require("body-parser");

const { STATUS_CODE } = require("@src/constants");

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    bodyParser.json(),
    validate({
        body: Joi
            .object()
            .keys({
                referral_code: Joi
                    .string()
                    .required()
            })
            .required(),
    }),
    async function addMyreferralsV1Controller(req, res) {
        try {
            const { user, body: { referral_code } } = req;
            if (user.referred_by) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({
                    message: 'Referral already added',
                    error: 'Referral already added'
                });
            }

            let isReferralExist = await User.findOne({ bxlend_id: referral_code })
            if (!isReferralExist) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Invalid referral code', error: 'Invalid referral code' });
            }
            // if (!isReferralExist?.email_verified_at || !isReferralExist?.phone_verified_at) {
            //     return res.status(STATUS_CODE.BAD_REQUEST).json({
            //         message: 'Referral account is not verified',
            //         error: 'Referral account is not verified',
            //     });
            // }
            if (isReferralExist?.referred_by == user?.bxlend_id) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({
                    message: 'you are already referred by this user',
                    error: 'you are already referred by this user',
                });
            }

            user.referred_by = isReferralExist.bxlend_id;
            if (user.id.toString() === isReferralExist._id.toString()) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Smart! You cannot refer yourself', error: "Smart! you cannot refer yourself" });
            }
            await user.save();
            return res.status(STATUS_CODE.OK).json({ message: 'Referral added successfully' });

        } catch (error) {
            console.log("🚀 ~ addMyreferralsV1Controller ~ error:", error)
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message, message: 'Internal server error' });
        }
    },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/users/add-referral:
 *   post:
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
