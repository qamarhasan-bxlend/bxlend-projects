
"use strict";
const {
  PresaleTransaction
} = require("@src/models");
const {
  STATUS_CODE,
  PRESALE_TRANSACTION_STATUS
} = require("@src/constants");
const bodyParser = require("body-parser");
const { auth, adminAuth } = require('@src/middlewares')
const validate = require("@root/src/middlewares/validator");
const { pageToSkip } = require("@src/utils/index");
const { Joi } = require("@src/lib")


// ------------------------- Controller -------------------------

const CONTROLLER = [
  auth(),
  adminAuth(),
  bodyParser.json(),
  validate({
    query: Joi.object().keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).default(10),
      status: Joi.string().valid(...Object.values(PRESALE_TRANSACTION_STATUS)), // Adjust statuses as needed
      order_number: Joi.string().optional(),
      blockchain: Joi.string().optional(),
      coin: Joi.string().optional(),
      bxt_base_price: Joi.number().min(0).optional(),
    }),
  }),
  async function listPresaleTransactionsController(req, res) {
    try {
      const {
        query: { page, limit, status, order_number, blockchain, coin, bxt_base_price },
      } = req;

      let toSkip = pageToSkip(page, limit),
        toLimit = limit;

      // Construct query object with dynamic filters
      let query = {
        deleted_at: { $exists: false },
      };

      if (status) query.status = status;
      if (order_number) query.transaction_number = order_number;
      if (blockchain) query.blockchain = { $regex: `^${blockchain}`, $options: 'i' }; // Case-insensitive 
      if (coin) query.payment_coin = { $regex: `^${coin}`, $options: 'i' };
      if (bxt_base_price) query.bxt_base_price = bxt_base_price.toString();

      const presaleTransactions = await PresaleTransaction.find(query)
        .populate("user_id")
        .skip(toSkip)
        .limit(toLimit);

      const total_count = await PresaleTransaction.countDocuments(query);

      if (!presaleTransactions) {
        return res.status(500).send({ message: "Could not fetch tokens' setup" });
      }
      const transactions = presaleTransactions.map((presaleTransaction) => {
        return {
          _id: presaleTransaction?._id,
          user_id: presaleTransaction?.user_id,
          status: presaleTransaction?.status,
          discount: presaleTransaction?.discount,
          deposit_address: presaleTransaction?.deposit_address,
          order_number: presaleTransaction.transaction_number,
          deposit_address: presaleTransaction?.deposit_address,
          "amount_in_usd": presaleTransaction?.amount_in_usd,
          "bxlend_token_base_price": presaleTransaction?.bxt_base_price,
          "blockchain_transaction_id": presaleTransaction?.blockchain_transaction_id,
          blockchain: presaleTransaction?.blockchain,
          "payment_coin": presaleTransaction?.payment_coin,
          "payment_screenshot": presaleTransaction?.payment_screenshot,
          "coin_price": presaleTransaction?.coin_price_at_order_time.coin_price,
          "coin_converted_price": presaleTransaction?.coin_price_at_order_time.converted_price,
          "token_allocation": presaleTransaction?.tokens_allocation.total,
          "presale_stage": presaleTransaction?.presale_stage,

        };
      });

      let page_count = Math.ceil(total_count / limit),
        meta = {
          page,
          limit,
          page_count,
          total_count,
        };

      res.json({ presale_transactions: transactions, meta });
    } catch (err) {
      console.log(err);
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: err?.message ?? err,
      });
    }
  },
];


// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
