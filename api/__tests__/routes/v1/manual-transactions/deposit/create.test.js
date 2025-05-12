"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/manual-transactions/deposit";

it("should create a Manual Deposit Transaction", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { ManualDepositTransaction } = require("@src/models");
  const faker = require("faker");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const wallet = await factory.cryptoWallet(user, currency);
  const accessToken = await factory.accessToken(user);

  const datas = {
    quantity: faker.finance.amount(),
    to: wallet._id.toString(),
    currency_code: currency.code,
  };

  const { body } = await http()
    .post(endpoint)
    .field("quantity", datas.quantity)
    .field("currency_code", datas.currency_code)
    .field("to", datas.to)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  const manual_transactions = await ManualDepositTransaction.find({});
  const manual_transaction = manual_transactions[0];

  expect(body).toEqual({ manual_transaction: serializeDocument(manual_transaction) });

});
