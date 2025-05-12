"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/admin/manual-transactions/withdraw/:transaction_id/execute";

it("should update a Manual Withdraw Transaction with success", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, TRANSACTION_STATUS } = require("@src/constants");
  const { ManualWithdrawTransaction } = require("@src/models");
  const { omit } = require("lodash");

  const [user, currency, country] = await Promise.all([
    factory.user(),
    factory.fiatCurrency(),
    factory.country(),
  ]);

  const [accessToken, wallet, bankAccount] = await Promise.all([
    factory.accessToken(user),
    factory.fiatWallet(user, currency),
    factory.bankAccount(user, country, currency),
  ]);

  let manual_transaction_created = await factory.manualWithdrawTransaction(user, wallet, bankAccount, 0, {
    populated: true,
    quantity: wallet.balance,
  });

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
    .field(changingProperty, changingValue)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  const manual_transactions = await ManualWithdrawTransaction.find({})
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
