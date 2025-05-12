
"use strict";
const {
  PresaleTransaction
} = require("@src/models");
const {
  STATUS_CODE
} = require("@src/constants");
const bodyParser = require("body-parser");
const { auth } = require('@src/middlewares')
const validate = require("@root/src/middlewares/validator");
const { pageToSkip } = require("@src/utils/index");
const { Joi } = require("@src/lib")


// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  bodyParser.json(),
  validate({
    query: Joi
      .object()
      .keys({
        page: Joi
          .number()
          .integer()
          .min(1)
          .default(1),
        limit: Joi
          .number()
          .integer()
          .min(1)
          .default(10),
      }),
  }),
  async function listPresaleTransactionsController(req, res) {
    try {
      const { user } = req
      const {
        query: { page, limit },
      } = req;
      let toSkip = pageToSkip(page, limit),
        toLimit = limit

      const presaleTransactions = await PresaleTransaction.find({
        deleted_at: { $exists: false },
        user_id: user._id
      }) .populate({
        path: 'user_id',
        select: '-password -updated_at -created_at -email -name -referred_by' // Exclude password and updated_at from user_id
      }).skip(toSkip)
        .limit(toLimit)

      const total_count = await PresaleTransaction.countDocuments({
        deleted_at: { $exists: false },
        user_id: user._id

      })
      let page_count = +Math.ceil(total_count / limit),
        meta = {
          page,
          limit,
          page_count,
          total_count,
        };
      if (!presaleTransactions) {
        return res.status(500).send({ message: "could not fetch tokens' setup" })
      }
      const transactions = presaleTransactions.map(transaction => {
        return {
          _id: transaction._id,
          user: transaction.user_id,
          status: transaction.status,
          deposit_address : transaction.deposit_address,
          transaction_number: transaction.transaction_number,
          "amount_in_usd": transaction.amount_in_usd,
          "bxlend_token_base_price": transaction.bxt_base_price,
          "blockchain_transaction_id": transaction.blockchain_transaction_id,
          "blockchain_name": transaction.blockchain,
          "payment_coin": transaction.payment_coin,
          "payment_screenshot": transaction.payment_screenshot,
          "coin_price": transaction.coin_price_at_order_time.coin_price,
          "coin_converted_price" : transaction.coin_price_at_order_time.converted_price,
          "token_allocation": transaction.tokens_allocation.total,
          "presale_stage": transaction.presale_stage,
        }
      })
      
      res.json({ presale_transactions: transactions, meta })

    } catch (err) {
      console.log(err)
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: err?.message ?? err
      })
    }
  }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
