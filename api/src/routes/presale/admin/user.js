"use strict"
const { Router } = require('express')
const { wrapController } = require('@src/utils')
const { getAdminPresaleUsersController,showAdminPresaleUserController } = require("@src/controllers")

const router = Router()

// ------------------------- Tickers -------------------------

router.route('/').get(wrapController(getAdminPresaleUsersController))
router.route('/:presale_user_id').get(wrapController(showAdminPresaleUserController))

// ------------------------- Exports -------------------------
module.exports = Router().use('/presale-user', router)
