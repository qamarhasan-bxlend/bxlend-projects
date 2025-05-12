"use strict";

const { BankAccount } = require("@src/models");
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
module.exports = async function manualDepositTransaction(owner, country, currency, options = {}) {

  const { populated } = options;
  const data = {
    owner: owner._id,
    bank_name: faker.company.companyName(),
    bank_country: country._id,
    account_number: faker.finance.account(),
    swift_bic_code: faker.finance.bic(),
    currency: currency._id,
  };

  if (populated) {
    const result = await BankAccount.create(data);
    return BankAccount.findOne({
      _id:result.id,
    })
      .populate("owner", "-created_at -updated_at -password")
      .populate("reviews.reviewer", "-created_at -updated_at -password")
      .populate("bank_country", "-created_at -updated_at -password");
  }

  return BankAccount.create(data);

};