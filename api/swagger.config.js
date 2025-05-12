"use strict";

const pkg = require("./package.json");

module.exports = {
  openapi: "3.0.0",
  info: {
    title: pkg.name,
    version: pkg.version,
    description: pkg.description,
    contact: {
      name: "API Support",
      email: "developers@btcex.pro",
    },
  },
  servers: [
    {
      url: "https://api.btcex.pro",
      description: "Production API",
    },
    {
      url: "https://api.bxlend.com",
      description: "Staging API",
    },
    {
      url: "http://localhost:3000",
      description: "Local API",
    },
  ],
  host: "api.btcex.pro",
  basePath: "",
  schemas: ["https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  components: {
    securitySchemes: {
      "OpenID Connect": {
        type: "openIdConnect",
        openIdConnectUrl: "https://auth.btcex.pro/.well-known/openid-configuration",
      },
    },
  },
  "x-tagGroups": [
    {
      name: "General",
      tags: [
        "Information",
        "User",
        "Country",
        "Verification"
      ],
    },
    {
      name: "User's Financial",
      tags: [
        "Bank Account",
        "Manual Transactions"
      ],
    },
    {
      name: "Admin",
      tags: [
        "System User's Bank Accounts",
        "System Bitgo Wallets",
        "System User's Manual Transactions",
        "System User's Orders",
        "Administrator Settings/Constants",
        "System Users"
      ]
    },
    {
      name: "Exchange",
      tags: [
        "Currency",
        "CurrencyPair",
        "Wallet",
        "Tickers",
        "Order Book"
      ],
    },
    {
      name: "Models",
      tags: [
        "user_model",
        "country_model",
        "currency_model",
        "currency_pair_model",
        "wallet_model",
        "transaction_model",
        "order_model",
        "ticker_model",
        "bank_account_model",
      ],
    },
  ],
};
