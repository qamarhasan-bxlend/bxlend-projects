"use strict";

const { ManualWithdrawTransaction } = require("@src/models");
const { TRANSACTION_STATUS } = require("@src/constants");
const faker = require("faker");

/**
 * Create a new Manual Withdraw Transaction for unit tests.
 *
 * @param {Object} owner
 * @param {Object} cryptoWallet
 * @param {Object} currency
 * @param {Number} attachmentsCount
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function manualWithdrawTransaction(owner, wallet, bankAccount, attachmentsCount = 0, options = {}) {

  const attachments = [];
  while(attachmentsCount--) attachments.push(faker.datatype.uuid());

  const { populated, quantity } = options;
  const data = {
    quantity: quantity? quantity: faker.finance.amount(),
    owner: owner._id,
    from: wallet._id,
    to: bankAccount._id,
    currency_code: wallet.currency_code,
    status: TRANSACTION_STATUS.PENDING,
    attachments,
  };

  if (populated) {
    const result = await ManualWithdrawTransaction.create(data);
    return ManualWithdrawTransaction.findOne({
      _id:result.id,
    })
      .populate("owner", "-created_at -updated_at -password")
      .populate("execution.executor", "-created_at -updated_at -password")
      .populate({
        path: "to",
        select: "-created_at -updated_at",
        populate: {
          path: "owner",
          select: "-created_at -updated_at -password",
        },
      });
  }

  return ManualWithdrawTransaction.create(data);

};