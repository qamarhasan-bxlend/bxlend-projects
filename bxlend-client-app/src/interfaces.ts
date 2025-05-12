export interface IPairObject {
  created_at: Date;
  currencies: string[];
  id: string;
  price: string;
  symbol: string;
  updated_at: Date;
}

export interface ITableData {
  ask: string;
  bid: string;
  high: string;
  last: string;
  low: string;
  open: string;
  open_24: string;
  pair: string;
  percent_change_24: string;
  side: string;
  timestamp: string;
  volume: string;
  vwap: string;
  id?: string;
}

export interface ITradeData {
  price: string;
  amount: string;
  timestamp: string;
}

export interface ITicker {
  pair: string;
  open: number;
  last: number;
  high: number;
  low: number;
  percent_change_24: number;
  volume: number;
}

export interface IPresaleInfo {
  minimum_deposit: {
    amount: number;
    currency: string;
  };
  _id: string;
  total_tokens: number;
  purchased_tokens: number;
  queued_tokens: number;
  base_price: {
    $numberDecimal: string;
  };
  current_stage: number;
  supported_payment_options: [
    {
      supported_coins: string[];
      _id: string;
      blockchain: string;
      deposit_address: string;
    },
    {
      supported_coins: string[];
      _id: string;
      blockchain: string;
      deposit_address: string;
    },
    {
      supported_coins: string[];
      _id: string;
      blockchain: string;
      deposit_address: string;
    },
    {
      supported_coins: string[];
      _id: string;
      blockchain: string;
      deposit_address: string;
    },
  ];
  base_price_for_each_stage: [
    {
      _id: string;
      stage: number;
      triggering_amount: number;
      price_increment: number;
    },
    {
      _id: string;
      stage: number;
      triggering_amount: number;
      price_increment: number;
    },
    {
      _id: string;
      stage: number;
      triggering_amount: number;
      price_increment: number;
    },
    {
      _id: string;
      stage: number;
      triggering_amount: number;
      price_increment: number;
    },
    {
      _id: string;
      stage: number;
      triggering_amount: number;
      price_increment: number;
    },
  ];
  discounts: [
    {
      _id: string;
      minimum_buy: number;
      discount: number;
    },
    {
      _id: string;
      minimum_buy: number;
      discount: number;
    },
    {
      _id: string;
      minimum_buy: number;
      discount: number;
    },
    {
      _id: string;
      minimum_buy: number;
      discount: number;
    },
  ];
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface IPresaleUser {
  total_allocation: number;
  pending_allocation: number;
  receiving_wallet: string;
  _id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  __v: number;
  referral_reward: {
    token_allocation: number;
  };
}

export interface IUser {
  id: string;
  email: string;
  email_verified: boolean;
  name: {
    first: string;
    last: string;
  };
  birthdate: string;
  phone_number: object;
  phone_number_verified: boolean;
  kyc_status: string;
  favorite_currencyPairs: string[];
  status: string;
  created_at: string;
  updated_at: string;
  twoFA_verified: boolean;
  bxlend_id: string;
  referred_by: null | string;
}

export interface ICountry {
  _id: string;
  code: string;
  name: string;
  phone_code: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface ICurrency {
  id: string;
  kind: string;
  code: string;
  name: string;
  display_decimals: number;
  decimals: number;
  icon: string;
  website: string;
  supported_blockchains: [
    {
      blockchain: {
        fee_priority_required: true;
        _id: string;
        name: string;
        symbol: string;
        description: string;
        website: string;
        native_currency: string;
        networks: [
          {
            _id: string;
            network_name: string;
            network_type: string;
            chain_id: number;
            rpc_url: string;
          },
          {
            _id: string;
            network_name: string;
            network_type: string;
            chain_id: number;
            rpc_url: string;
          },
        ];
        token_standards: [
          {
            _id: string;
            standard_name: string;
            description: string;
          },
        ];
        platforms: [
          {
            platform_name: string;
            _id: string;
            platform_id: string;
            platform_options: {
              label: string;
              network: string;
            };
          },
        ];
        updated_at: string;
        vaultody_name: string;
      };
      withdrawal_options: {
        is_allowed: true;
        is_suspended: false;
      };
      deposit_options: {
        is_allowed: true;
        is_suspended: false;
      };
    },
  ];
  created_at: string;
  updated_at: string;
}
