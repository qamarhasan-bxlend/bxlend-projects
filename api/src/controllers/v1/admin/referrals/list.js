"use strict";

const validate = require("@root/src/middlewares/validator");
const { User } = require("@src/models");
const { Joi } = require("@src/lib");
const { auth, adminAuth } = require("@src/middlewares");
const { pageToSkip } = require("@src/utils/index");
// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    adminAuth(),
    validate({
        query: Joi.object().keys({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).default(10),
        }),
    }),
    async function listReferralsV1Controller(req, res) {
        const {
            query: { page, limit },
        } = req;

        const filter = {
            $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
            referred_by: { $ne: null },
        };

        const total_count = await User.countDocuments(filter);

        let toSkip = pageToSkip(page, limit);
        let toLimit = limit;
        let page_count = Math.ceil(total_count / limit);

        let referrals = await User.aggregate([
            { $match: filter },
            { $sort: { created_at: -1 } },
            { $skip: toSkip },
            { $limit: toLimit },
            {
                $lookup: {
                    from: "users",
                    localField: "referred_by",
                    foreignField: "bxlend_id", // Since `referred_by` is a string, match it with `bxlend_id`
                    as: "referrer",
                },
            },
            {
                $unwind: { path: "$referrer", preserveNullAndEmptyArrays: true },
            },
            {
                $project: {
                    referral_name: "$name",
                    referral_id: "$_id",
                    referral_bxlend_id: {
                        $cond: {
                            if: { $ifNull: ["$bxlend_id", false] },
                            then: "$bxlend_id",
                            else: "N/A",
                        },
                    },
                    referred_by_name: { $ifNull: ["$referrer.name", "N/A"] },
                    referred_by_id: { $ifNull: ["$referrer._id", "N/A"] },
                    referred_by_bxlend_id: {
                        $cond: {
                            if: { $ifNull: ["$referrer.bxlend_id", false] },
                            then: "$referrer.bxlend_id",
                            else: "N/A",
                        },
                    },
                },
            },
        ]);

        referrals = referrals.map((referral) => ({
            ...referral,
            referral_bxlend_id: referral.referral_bxlend_id ? referral.referral_bxlend_id.match(/.{1,3}/g)?.join('-') : "N/A",
            referred_by_bxlend_id: referral.referred_by_bxlend_id ? referral.referred_by_bxlend_id.match(/.{1,3}/g)?.join('-') : "N/A",
        }));

        const meta = {
            page,
            limit,
            page_count,
            total_count,
        };

        res.json({
            data: referrals,
            meta,
        });
        // }
    }

];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;

// ------------------------- Swagger ----------------------------

/**
 * @swagger
 *
 * /v1/admin/referral:
 *   get:
 *     tags:
 *       - Referrals
 *     description: Show All referrals
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Referrals Fetched successfully
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
