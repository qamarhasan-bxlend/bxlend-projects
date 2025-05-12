const { listTransactionsDashboardAdminV1 , listDepositTransactionsDashboardAdminV1, listWithdrawTransactionsDashboardAdminV1} = require("@src/controllers");
const {wrapController} = require('@src/utils');
const {Router} = require('express')
const router = Router();

//-----------------------transactions-----------------------

router.route('/')
.get(wrapController(listTransactionsDashboardAdminV1))
router.route('/deposit')
.get(wrapController(listDepositTransactionsDashboardAdminV1))
router.route('/withdraw')
.get(wrapController(listWithdrawTransactionsDashboardAdminV1))




//-----------------------Exports------------------------

module.exports = Router().use('/transactions',router)
