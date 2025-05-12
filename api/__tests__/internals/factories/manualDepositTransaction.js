"use strict";

const { ManualDepositTransaction } = require("@src/models");
const { TRANSACTION_STATUS } = require("@src/constants");
const faker = require("faker");

/**
 * Create a new Manual Deposit Transaction for unit tests.
 *
 * @param {Object} owner
 * @param {Object} cryptoWallet
 * @param {Object} currency
 * @param {Number} attachmentsCount
 * @returns {Promise<import("mongoose").Document>}
 */
module.exports = async function manualDepositTransaction(
  owner,
  cryptoWallet,
  currency,
  attachmentsCount,
  options = {},
) {

  const attachments = [];
  while (attachmentsCount--) attachments.push(faker.datatype.uuid());

  const { populated } = options;
  const data = {
    quantity: faker.finance.amount(),
    owner: owner._id,
    to: cryptoWallet._id,
    currency_code: currency.code,
    status: TRANSACTION_STATUS.PENDING,
    attachments,
  };

  if (populated) {
    const result = await ManualDepositTransaction.create(data);
    return ManualDepositTransaction.findOne({
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

  return ManualDepositTransaction.create(data);

};
