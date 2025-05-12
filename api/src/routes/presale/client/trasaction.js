"use strict"
const { Router } = require('express')
const { wrapController } = require('@src/utils')
const { listPresaleTransactionsController, createPresaleTransactionsController, cancelPresaleTransactionsController, confirmPresaleTransactionsController } = require("@src/controllers")

const router = Router()

// ------------------------- Tickers -------------------------

router.route('/').get(wrapController(listPresaleTransactionsController))
router.route('/').post(wrapController(createPresaleTransactionsController))
router.route('/cancel').put(wrapController(cancelPresaleTransactionsController))
router.route('/').put(wrapController(confirmPresaleTransactionsController))

// ------------------------- Exports -------------------------
module.exports = Router().use('/presale-transaction', router)
