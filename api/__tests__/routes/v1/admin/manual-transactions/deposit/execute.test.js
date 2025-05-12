"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/admin/manual-transactions/deposit/:transaction_id/execute";

it("should execute a Manual Deposit Transaction", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, TRANSACTION_STATUS } = require("@src/constants");
  const { ManualDepositTransaction } = require("@src/models");
  const { omit } = require("lodash");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const wallet = await factory.cryptoWallet(user, currency);
  let manual_transaction_created = await factory.manualDepositTransaction(user, wallet, currency, 0, {
    populated: true,
  });
  const accessToken = await factory.accessToken(user);

  const changingProperty = "status";
  const changingValue = TRANSACTION_STATUS.SUCCESS;

  manual_transaction_created = JSON.parse(JSON.stringify(manual_transaction_created));

  manual_transaction_created[changingProperty] = changingValue;
  manual_transaction_created.execution = {
    executor: omit(JSON.parse(JSON.stringify(user)), ["updated_at", "created_at"]),
    isExecuted: true,
    reason: null,
  };
  manual_transaction_created = omit(manual_transaction_created, ["updated_at", "created_at"]);

  await http()
    .patch(endpoint.replace(":transaction_id", manual_transaction_created.id))
    .send({
      [changingProperty]: changingValue,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  const manual_transactions = await ManualDepositTransaction.find({})
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
  const manual_transaction = JSON.parse(JSON.stringify(manual_transactions[0]));
  delete manual_transaction.updated_at;
  delete manual_transaction.created_at;
  delete manual_transaction.execution.timestamp;

  expect(manual_transaction).toEqual(manual_transaction_created);

});
