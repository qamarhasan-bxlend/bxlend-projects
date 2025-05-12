"use strict"
const { Router } = require('express')
const { wrapController } = require('@src/utils')
const { createWaitingListRegisteration } = require("@src/controllers")

const router = Router()

// ------------------------- Routes -------------------------

router.route('/').post(wrapController(createWaitingListRegisteration))

// ------------------------- Exports -------------------------
module.exports = Router().use('/register', router)

