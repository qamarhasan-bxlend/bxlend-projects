"use strict"
const { Router } = require('express')
const { wrapController } = require('@src/utils')
const { listPresaleTransactionsAdminController, rejectPresaleTransactionAdminController, showPresaleTransactionAdminController , confirmPresaleTransactionAdminController } = require("@src/controllers")

const router = Router()

// ------------------------- Tickers -------------------------

router.route('/').get(wrapController(listPresaleTransactionsAdminController))
router.route('/:presale_transaction_id').get(wrapController(showPresaleTransactionAdminController))
router.route('/reject').put(wrapController(rejectPresaleTransactionAdminController))
router.route('/confirm').put(wrapController(confirmPresaleTransactionAdminController))

// ------------------------- Exports -------------------------
module.exports = Router().use('/presale-transaction', router)
