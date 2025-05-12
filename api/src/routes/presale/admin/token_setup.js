"use strict"
const { Router } = require('express')
const { wrapController } = require('@src/utils')
const { listAdminPresaleTokenSetupController, updateAdminPresaleTokenSetupController } = require("@src/controllers")

const router = Router()

// ------------------------- Tickers -------------------------

router.route('/').get(wrapController(listAdminPresaleTokenSetupController))
router.route('/').put(wrapController(updateAdminPresaleTokenSetupController))

// ------------------------- Exports -------------------------
module.exports = Router().use('/presale-info', router)
