const { createWithdrawTransactionsV1, listWithdrawTransactionsV1, listDepositTransactionsV1 , showDepositTransactionsV1, showWithdrawTransactionsV1,listTransactionsV1,showTransactionsV1,getWithdrawalFeeRecommendationv1} = require("@src/controllers");
const {wrapController} = require('@src/utils');
const {Router} = require('express')
const router = Router();

//-----------------------Withdraw-----------------------

router.route('/withdraw').post(wrapController(createWithdrawTransactionsV1));
router.route('/withdraw').get(wrapController(listWithdrawTransactionsV1))
router.route('/withdraw/:transaction_id').get(wrapController(showWithdrawTransactionsV1))
router.route('/withdraw/fee/recommendation').get(wrapController(getWithdrawalFeeRecommendationv1))


//-----------------------Deposit------------------------
router.route('/deposit').get(wrapController(listDepositTransactionsV1))
router.route('/deposit/:transaction_id').get(wrapController(showDepositTransactionsV1))


//-----------------------General------------------------
router.route('/').get(wrapController(listTransactionsV1))
router.route('/:transaction_id').get(wrapController(showTransactionsV1))

//-----------------------Exports------------------------

module.exports = Router().use('/transactions',router)
