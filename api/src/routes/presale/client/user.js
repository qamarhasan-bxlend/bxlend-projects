"use strict"
const { Router } = require('express')
const { wrapController } = require('@src/utils')
const { getPresaleUserController,updateReceivingWalletController } = require("@src/controllers")

const router = Router()

// ------------------------- Tickers -------------------------

router.route('/').get(wrapController(getPresaleUserController))
router.route('/').put(wrapController(updateReceivingWalletController))

// ------------------------- Exports -------------------------
module.exports = Router().use('/presale-user', router)
