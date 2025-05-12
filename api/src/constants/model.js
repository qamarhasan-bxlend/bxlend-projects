"use strict";

const MODEL = {
  SETTING: "Setting",
  CLIENT: "Client",
  COUNTRY: "Country",
  CURRENCY: "Currency",
  FIAT_CURRENCY: "FiatCurrency",
  CRYPTO_CURRENCY: "CryptoCurrency",
  CURRENCY_PAIR: "CurrencyPair",
  OAUTH_AUTHORIZATION_CODE: "OAuthAuthorizationCode",
  OAUTH_GRANT: "OAuthGrant",
  OAUTH_INTERACTION: "OAuthInteraction",
  OAUTH_SESSION: "OAuthSession",
  ORDER: "Order",
  MARKET_ORDER: "MarketOrder",
  LIMIT_ORDER: "LimitOrder",
  STOP_LIMIT_ORDER: "StopLimitOrder",
  TICKER: "Ticker",
  TOKEN: "Token",
  TRANSACTION: "Transaction",
  DEPOSIT_TRANSACTION: "DepositTransaction",
  TRANSFER_TRANSACTION: "TransferTransaction",
  WITHDRAW_TRANSACTION: "WithdrawTransaction",
  MANUAL_DEPOSIT_TRANSACTION: "ManualDepositTransaction",
  MANUAL_WITHDRAW_TRANSACTION: "ManualWithdrawTransaction",
  USER: "User",
  VERIFICATION: "Verification",
  EMAIL_VERIFICATION: "EmailVerification",
  PHONE_NUMBER_VERIFICATION: "PhoneNumberVerification",
  WALLET: "Wallet",
  FIAT_WALLET: "FiatWallet",
  CRYPTO_WALLET: "CryptoWallet",
  INTERNAL_WALLET: "InternalWallet",
  BANK_ACCOUNT: "BankAccount",
  ADMIN_SETTING: "AdminSetting",
  KYC: "Kyc",
  RESET_PASSWORD: "ResetPassword",
  WAITING_LIST_USERS: 'WaitingListUsers',
  WAITING_LIST_USERS_VERIFICATION: 'WaitingListUsersVerification',
  NOTIFICATIONS: "Notifications",
  MARKET_TRADES: "MarketTrades",
  TRANSACTION_FEE: "TransactionFee",
  BLOCKCHAIN: "Blockchain",
  PRESALE_USER: "PresaleUsers",
  PRESALE_TOKEN_SETUP: "PresaleTokenSetup",
  PRESALE_TRANSACTION: "PresaleTransactions"

};

const COLLECTION = {
  SETTING: "settings",
  CLIENT: "clients",
  COUNTRY: "countries",
  CURRENCY: "currencies",
  CURRENCY_PAIR: "currency_pairs",
  OAUTH_GRANT: "oauth_grants",
  OAUTH_INTERACTION: "oauth_interactions",
  OAUTH_SESSION: "oauth_sessions",
  ORDER: "orders",
  TICKER: "tickers",
  TOKEN: "tokens",
  TRANSACTION: "transactions",
  USER: "users",
  VERIFICATION: "verifications",
  WALLET: "wallets",
  BANK_ACCOUNT: "bank_account",
  ADMIN_SETTING: "admin_setting",
  KYC: "kyc",
  RESET_PASSWORD: "reset_password",
  WAITING_LIST_USERS: "waiting_list_users",
  NOTIFICATIONS: "notifications",
  MARKET_TRADES: "market_trades",
  TRANSACTION_FEE: "transaction_fee",
  BLOCKCHAIN: "blockchains",
  PRESALE_USER: "presale_users",
  PRESALE_TOKEN_SETUP: "presale_token_setup",
  PRESALE_TRANSACTION: "presale_transactions"
};

const TIMESTAMPS = {
  createdAt: "created_at",
  updatedAt: "updated_at",
};

const DISCRIMINATOR = "kind";

const OWNER = {
  USER: "USER",
  CLIENT: "CLIENT",
};

module.exports = {
  MODEL,
  COLLECTION,
  TIMESTAMPS,
  DISCRIMINATOR,
  OWNER,
};
