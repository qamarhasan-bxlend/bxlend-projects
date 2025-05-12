"use strict";

const ERROR = {
  NOT_FOUND: "not-found",
  BLOCKCHAIN_NOT_FOUND: "blockchain-not-found",
  CURRENCY_NOT_FOUND: "currency-not-found",
  CURRENCY_PAIR_NOT_FOUND: "currency-pair-not-found",
  USER_NOT_FOUND: "user-not-found",
  USER_NOT_VERIFIED :"user-not-verified",
  SETTING_NOT_FOUND: "setting-not-found",
  SETTING_COULDNOT_BE_UPDATED: "setting-couldnot-be-updated",
  BANK_ACCOUNT_NOT_FOUND: "bank-account-not-found",
  MANUAL_TRANSACTION_NOT_FOUND: "manual-transaction-not-found",
  INSUFFICIENT_FUNDS: "insufficient-funds",
  MANUAL_TRANSACTION_ALREADY_EXECUTED: "manual-transaction-already-executed",
  UNAUTHORIZED: "unauthorized",
  ACCESS_TOKEN_MISSING: "access-token-missing",
  FORBIDDEN: "forbidden",
  UNPROCESSABLE_ENTITY: "unprocessable-entity",
  BAD_REQUEST: "bad-request",
  INTERNAL_SERVER_ERROR: "internal-server-error",
  PAYMENT_REQUIRED: "payment-required",
  UNKNOWN_EMAIL: "unknown-email",
  EMAIL_NOT_VERIFIED: "email-not-verified",
  MISSING_ATTACHMENT: "missing-attachment",
  EXCEEDS_SIZE_LIMIT: "exceeds-size-limit",
  UNSUPPORTED_FORMAT: "unsupported-format",
  COUNTRY_NOT_FOUND: "country-not-found",
  KYC_NOT_FOUND: "kyc-not-found",
  WALLET_NOT_FOUND: "wallet_not_found",
  WITHDRAW_TRANSACTION_NOT_FOUND :"withdraw-transaction-not-found",
  DEPOSIT_TRANSACTION_NOT_FOUND :"deposit-transaction-not-found",
  TRANSACTION_NOT_FOUND : "transaction_not_found",  
  TICKER_NOT_FOUND : "ticker_not_found",
  COMPLETE_TWO_FACTOR_AUTHENTICATION_FIRST :"complete-two-factor-authentication-first",
  KYC_NOT_VERIFIED : "kyc-not-verified",
  INVALID_TWO_FA_CODE : "invalid-two-fa-code",
  NOTIFICATION_NOT_FOUND : "notification-not-found",
  MARKET_TRADE_NOT_FOUND : "market-trade-not-found"
};

module.exports = {
  ERROR,
};
