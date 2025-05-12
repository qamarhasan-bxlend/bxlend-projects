"use strict";

const validate = require("@root/src/middlewares/validator");
const { Joi, CryptoApis } = require("@src/lib");
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { Currency, TransactionFee } = require('@src/models')
// ------------------------- Controller -------------------------

const CONTROLLER = [
    // auth(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    validate({
        query: Joi
            .object()
            .keys({
                blockchain: Joi.string(),
                network: Joi.string()
            })
            .required(),
    }),
    async function getWithdrawalFeeRecommendation(req, res) {
        try {
            const {
                blockchain,
                network
            } = req.query;
            // console.log(req.query)

            const currencyData = await Currency.findOne({
                code: blockchain,
                // networks : network
            });
            console.log("🚀 ~ getWithdrawalFeeRecommendation ~ currencyData:", currencyData)
            // console.log(currencyData)
            const currencyName = currencyData?.name?.toLowerCase()
            if (!currencyName) {
                throw new Error('could not find currency')
            }
            const data = await TransactionFee.findOne({
                code : currencyName,
                network : network.toLowerCase()
            }) //await CryptoApis.getFeeRecommendation(currencyName, network)
            if (!data) {
                throw new Error('could not fetch fee')
            }
            const fee = data
            // console.log(fee)
            res.status(200).json({ fee })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: error.message ?? error
            });
        }
    },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;