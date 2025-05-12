"use strict";

const { MODEL: NAME, COLLECTION, NETWORK_TYPE, TIMESTAMPS, CRYPTO_WALLET_PLATFORM, PROTOCOL_TYPE } = require("@src/constants");
const { Schema, model } = require("mongoose");

// ------------------------- Schema -----------------------------

const SCHEMA = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    vaultody_name: {
      type: String,
      required: true,
      unique: true,
    },
    symbol: {
      type: String,
      required: true,
      unique: true, // Short identifier (e.g., ETH, SOL)
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    native_currency: {
      type: String, // Currency for transaction fees (e.g., ETH for Ethereum)
      required: true,
    },
    protocol_type:{
      type: String,
      required:true,
      enum: Object.values(PROTOCOL_TYPE) // Classify protocols ['utxo-based', 'account-based']
    },
    fee_priority_required:{
      type: Boolean,
      default: true 
    },
    /**
     * Networks available within this blockchain
     * For example, Ethereum might have mainnet and testnet, Solana might have devnet
     */
    networks: [
      {
        network_name: {
          type: String,
          required: true, // e.g., "Mainnet", "Ropsten"
        },
        network_type: {
          type: String, 
          enum: Object.values(NETWORK_TYPE), // Classify networks ['mainnet', 'testnet', 'devnet']
          required: true,
        },
        chain_id: {
          type: Number, // Unique identifier for network (e.g., Ethereum Mainnet is 1)
          required: true,
        },
        rpc_url: {
          type: String, // The URL used to connect to this network
        },
      },
    ],
    token_standards: [
      {
        standard_name: {
          type: String,
          required: true, // e.g., ERC-20, SPL
        },
        description: {
          type: String,
        },
      },
    ],
    platforms: [{
      platform_name: {
        type: String,
        enum: Object.values(CRYPTO_WALLET_PLATFORM),
        default: CRYPTO_WALLET_PLATFORM.VAULTODY,
        required: true
      },
      platform_id: { type: String },  // ID for the platform's wallet (could be main wallet id or vault id but not the api key or secret)
      platform_options: { type: Schema.Types.Mixed }  // Any additional configuration options
    }]
  
  },
  {
    collection: COLLECTION.BLOCKCHAIN,
    timestamps: TIMESTAMPS
  }
);

// ------------------------- Model ------------------------------

const Blockchain = model(NAME.BLOCKCHAIN, SCHEMA);

// ------------------------- Exports ----------------------------

module.exports = Blockchain;
