"use strict";

/* istanbul ignore file */

const client = require("../client");
const responseHandler = require("../responseHandler");

function getAll() {
  return responseHandler(client.get("/wallets"));
}

function get(coin, limit) {
  return responseHandler(client.get(`/${coin}/wallet?limit=${limit}`));
}

function getByAddress(coin, address) {
  return responseHandler(client.get(`/${coin}/wallet/address/${address}`));
}

function getUnspents(
  coin,
  walletId,
  { limit, maxValue, minConfirms, enforceMinConfirmsForChange, minHeight, minValue, prevId, segwit } = {},
) {
  return responseHandler(
    client.get(`/${coin}/wallet/${walletId}/unspents`, {
      params: { limit, maxValue, minConfirms, enforceMinConfirmsForChange, minHeight, minValue, prevId, segwit },
    }),
  );
}

function getMaximumSpendable(
  coin,
  walletId,
  {
    limit,
    allTokens,
    feeRate,
    minConfirms,
    enforceMinConfirmsForChange,
    maxFeeRate,
    maxValue,
    minHeight,
    minValue,
    numBlocks,
  } = {},
) {
  return responseHandler(
    client.get(`/${coin}/wallet/${walletId}/maximumSpendable`, {
      params: {
        limit,
        allTokens,
        feeRate,
        minConfirms,
        enforceMinConfirmsForChange,
        maxFeeRate,
        maxValue,
        minHeight,
        minValue,
        numBlocks,
      },
    }),
  );
}

function getSpendingLimits(coin, walletId) {
  return responseHandler(client.get(`/${coin}/wallet/${walletId}/spending`));
}

function getAllReservedUnspent(walletId, { prevId, limit, expireTimeGt, expireTimeLte } = {}) {
  return responseHandler(
    client.get(`/wallet/${walletId}/reservedunspents`, {
      params: {
        prevId,
        limit,
        expireTimeGt,
        expireTimeLte,
      },
    }),
  );
}

function getAllBalances({ id, coin, deleted, enterprise, labelContains, type, expandCustodialWallet } = {}) {
  return responseHandler(
    client.get("/wallet/balances", {
      params: {
        id,
        coin,
        deleted,
        enterprise,
        labelContains,
        type,
        expandCustodialWallet,
      },
    }),
  );
}

function getBalanceReserveData(coin) {
  return responseHandler(client.get(`/${coin}/requiredReserve`));
}

function update(
  coin,
  walletId,
  { approvalsRequired, buildDefaults, disableTransactionNotifications, label, customChangeKeySignatures } = {},
) {
  return responseHandler(
    client.post(`/${coin}/wallet/${walletId}`, {
      approvalsRequired,
      buildDefaults,
      disableTransactionNotifications,
      label,
      customChangeKeySignatures,
    }),
  );
}

function create(
  coin,
  {
    coinSpecific,
    enterprise,
    isCold,
    isCustodial,
    keys,
    keySignatures,
    label,
    address,
    m,
    n,
    tags,
    type,
    walletVersion,
  } = {},
) {
  return responseHandler(
    client.post(`/${coin}/wallet`, {
      coinSpecific,
      enterprise,
      isCold,
      isCustodial,
      keys,
      keySignatures,
      label,
      address,
      m,
      n,
      tags,
      type,
      walletVersion,
    }),
  );
}

function makeReservedUnspents(walletId, { unspentIds, expireTime } = {}) {
  return responseHandler(
    client.post(`/wallet/${walletId}/reservedunspents`, {
      unspentIds,
      expireTime,
    }),
  );
}

function modifyReservedUnspents(walletId, { unspentIds, changes } = {}) {
  return responseHandler(
    client.put(`/wallet/${walletId}/reservedunspents`, {
      unspentIds,
      changes,
    }),
  );
}

function remove(coin, walletId) {
  return responseHandler(client.delete(`/${coin}/wallet/${walletId}`));
}

function removeUserFrom(coin, walletId, userId) {
  return responseHandler(client.delete(`/${coin}/wallet/${walletId}/user/${userId}`));
}

function releaseReservedUnspent(walletId, { id } = {}) {
  return responseHandler(
    client.delete(`/wallet/${walletId}/reservedunspents`, {
      params: {
        id,
      },
    }),
  );
}

function freeze(coin, walletId, { duration } = {}) {
  return responseHandler(client.post(`/${coin}/wallet/${walletId}/freeze`, { duration }));
}

function buildTransaction(
  coin,
  walletId,
  {
    numBlocks,
    feeRate,
    maxFeeRate,
    minConfirms,
    enforceMinConfirmsForChange,
    gasPrice,
    gasLimit,
    targetWalletUnspents,
    minValue,
    maxValue,
    sequenceId,
    noSplitChange,
    unspents,
    changeAddress,
    instant,
    memo,
    comment,
    addressType,
    startTime,
    consolidateId,
    lastLedgerSequence,
    ledgerSequenceDelta,
    cpfpTxIds,
    cpfpFeeRate,
    maxFee,
    idfVersion,
    idfSignedTimestamp,
    idfUserId,
    strategy,
    validFromBlock,
    validToBlock,
    type,
    trustlines,
    messageKey,
    reservation,
    recipients, // or nonParticipation
    nonParticipation, // or recipients
  } = {},
) {
  return responseHandler(
    client.post(`${coin}/wallet/${walletId}/tx/build`, {
      numBlocks,
      feeRate,
      maxFeeRate,
      minConfirms,
      enforceMinConfirmsForChange,
      gasPrice,
      gasLimit,
      targetWalletUnspents,
      minValue,
      maxValue,
      sequenceId,
      noSplitChange,
      unspents,
      changeAddress,
      instant,
      memo,
      comment,
      addressType,
      startTime,
      consolidateId,
      lastLedgerSequence,
      ledgerSequenceDelta,
      cpfpTxIds,
      cpfpFeeRate,
      maxFee,
      idfVersion,
      idfSignedTimestamp,
      idfUserId,
      strategy,
      validFromBlock,
      validToBlock,
      type,
      trustlines,
      messageKey,
      reservation,
      recipients, // or nonParticipation
      nonParticipation, // or recipients
    }),
  );
}

function initiateTransaction(
  coin,
  walletId,
  {
    numBlocks,
    feeRate,
    maxFeeRate,
    minConfirms,
    enforceMinConfirmsForChange,
    gasPrice,
    gasLimit,
    targetWalletUnspents,
    minValue,
    maxValue,
    sequenceId,
    noSplitChange,
    unspents,
    changeAddress,
    instant,
    memo,
    comment,
    addressType,
    startTime,
    consolidateId,
    lastLedgerSequence,
    ledgerSequenceDelta,
    cpfpTxIds,
    cpfpFeeRate,
    maxFee,
    idfVersion,
    idfSignedTimestamp,
    idfUserId,
    strategy,
    validFromBlock,
    validToBlock,
    type,
    trustlines,
    messageKey,
    reservation,
    videoApprovers,
  } = {},
) {
  return responseHandler(
    client.put(`${coin}/wallet/${walletId}/tx/initiate`, {
      numBlocks,
      feeRate,
      maxFeeRate,
      minConfirms,
      enforceMinConfirmsForChange,
      gasPrice,
      gasLimit,
      targetWalletUnspents,
      minValue,
      maxValue,
      sequenceId,
      noSplitChange,
      unspents,
      changeAddress,
      instant,
      memo,
      comment,
      addressType,
      startTime,
      consolidateId,
      lastLedgerSequence,
      ledgerSequenceDelta,
      cpfpTxIds,
      cpfpFeeRate,
      maxFee,
      idfVersion,
      idfSignedTimestamp,
      idfUserId,
      strategy,
      validFromBlock,
      validToBlock,
      type,
      trustlines,
      messageKey,
      reservation,
      videoApprovers,
    }),
  );
}

function sendHalfSignedTransaction(
  coin,
  walletId,
  { comment, halfSigned, txHex, sequenceId, suppressBroadcast, buildParams, videoApprovers } = {},
) {
  return responseHandler(
    client.post(`${coin}/wallet/${walletId}/tx/send`, {
      comment,
      halfSigned,
      txHex,
      sequenceId,
      suppressBroadcast,
      buildParams,
      videoApprovers,
    }),
  );
}

function initiateTrustlineTransaction(coin, walletId, { memo, comment, trustlines } = {}) {
  return responseHandler(
    client.post(`${coin}/wallet/${walletId}/trustline/initiate`, {
      memo,
      comment,
      trustlines,
    }),
  );
}

module.exports = {
  getAll,
  get,
  getByAddress,
  getUnspents,
  getMaximumSpendable,
  getSpendingLimits,
  getAllReservedUnspent,
  getAllBalances,
  getBalanceReserveData,
  update,
  create,
  makeReservedUnspents,
  modifyReservedUnspents,
  remove,
  removeUserFrom,
  releaseReservedUnspent,
  buildTransaction,
  initiateTransaction,
  sendHalfSignedTransaction,
  initiateTrustlineTransaction,
  freeze,
};
