"use strict"
const { Router } = require('express')
const { wrapController } = require('@src/utils')
const { listClientPresaleTokenSetupController } = require("@src/controllers")

const router = Router()

// ------------------------- Tickers -------------------------

router.route('/').get(wrapController(listClientPresaleTokenSetupController))

// ------------------------- Exports -------------------------
module.exports = Router().use('/presale-info', router)
