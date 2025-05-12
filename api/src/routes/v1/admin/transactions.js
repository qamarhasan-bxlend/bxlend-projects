const { showDepositTransactionAdminV1, showWithdrawTransactionAdminV1, createWithdrawTransactionsAdminV1, listWithdrawTransactionsAdminV1, listDepositTransactionsAdminV1,listTransactionsAdminV1,showTransactionAdminV1 } = require("@src/controllers");
const {wrapController} = require('@src/utils');
const {Router} = require('express')
const router = Router();

//-----------------------Withdraw-----------------------


router.route('/withdraw')
.post(wrapController(createWithdrawTransactionsAdminV1)); // TODO for admin
router.route('/withdraw')
.get(wrapController(listWithdrawTransactionsAdminV1))
router.route('/withdraw/:transaction_id')
.get(wrapController(showWithdrawTransactionAdminV1))




//-----------------------Deposit------------------------

router.route('/deposit')
.get(wrapController(listDepositTransactionsAdminV1))
router.route('/deposit/:transaction_id')
.get(wrapController(showDepositTransactionAdminV1))

//----------------------General------------------------

router.route('/')
.get(wrapController(listTransactionsAdminV1))
router.route('/:transaction_id')
.get(wrapController(showTransactionAdminV1))


//-----------------------Exports------------------------

module.exports = Router().use('/transactions',router)
