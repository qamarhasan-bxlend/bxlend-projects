import { BsGraphUpArrow } from 'react-icons/bs';
import { PiPlusMinusBold } from 'react-icons/pi';
import { LuLayoutDashboard } from 'react-icons/lu';
import { MdBorderColor } from 'react-icons/md';
import { BsWalletFill } from 'react-icons/bs';
import { LuDollarSign } from 'react-icons/lu';

import LogoSpotlight from './assets/LogoSpotlight.jpg';
import Mission from './assets/Mission.jpg';
import Intro from './assets/Intro.jpg';
import IntroPartTwo from './assets/IntroPartTwo.jpg';
import CryptoEconomy from './assets/CryptoEconomy.jpg';
import Background from './assets/Background.jpg';
import SaleDetails from './assets/SaleDetails.jpg';
import TokenDestribution from './assets/TokenDestribution.jpg';
import Roadmap from './assets/Roadmap.jpg';
import Team from './assets/Team.jpg';
import TeamPartTwo from './assets/TeamPartTwo.jpg';
import TeamPartThree from './assets/TeamPartThree.jpg';

import { AUTH_REDIRECT_URI, AUTH_URL, CLIENT_ID } from './configs';
import {
  ROUTE_DASHBOARD,
  ROUTE_MARKET,
  ROUTE_OPEN_ORDERS,
  ROUTE_ORDERS,
  ROUTE_PRESALE,
  ROUTE_WALLET,
} from './routes';

export const OPEN_ORDERS_HEADERS = [
  'Date',
  'Pair',
  'Type',
  'Owner type',
  'Price',
  'Amount',
  'Status',
  'Total',
  'Details',
];

export const ORDER_HISTORY_HEADERS = [
  'Order time',
  'Pair',
  'Type',
  'Side',
  'Price',
  'Executed',
  'Amount',
  'Total',
  'Status',
  'Details',
];

export const TRADE_HISTORY_HEADERS = [
  'Date',
  'Pair',
  'Side',
  'Price',
  'Filled',
  'Fee',
  'Role',
  'Total',
  'Details',
];

export const TRANSACTIONS_CRYPTO_HEADERS = [
  'Time',
  'Currency',
  'Type',
  'Wallet ID',
  'Amount',
  'Status',
  'Details',
];

export const TRANSACTIONS_FIAT_HEADERS = [
  'Title',
  'Coin',
  'Amount',
  'Status',
  'Information',
  'Details',
];

export const OPEN_ORDERS_BTNS = [
  { text: '', label: 'All' },
  { text: 'Type', label: 'All' },
];

export const ORDER_HISTORY_BTNS = [
  { text: '', label: 'All' },
  { text: 'Type', label: 'All' },
];

export const TRADE_HISTORY_BTNS = [
  { text: '', label: 'All' },
  { text: 'Type', label: 'All' },
];

export const ASIDE_LINKS = [
  { title: 'Open Orders', to: 'open-orders' },
  { title: 'Order History', to: 'order-history' },
  { title: 'Trade History', to: 'trade-history' },
];

export const TRANSACTIONS_CRYPTO_BTNS = [
  { id: 1, text: 'Deposit', hasDropDown: true, caption: 'Type' },
];

export const TRANSACTIONS_FIAT_BTNS = [
  { id: 1, text: 'Deposit', hasDropDown: true, caption: 'Type' },
];

export const convertDate = (str: string) => {
  const dateObj = new Date(str);
  const date = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${dateObj.getFullYear()}`;
  const time = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return { date, time };
};

export const extractCurrencies = (pairString) => {
  const pair = pairString.split('=')[1];
  const currencies = pair.split('-');
  return currencies.map((currency) => currency.toUpperCase());
};

export const getSign = () => {
  const scopes = [
    'offline_access',
    'write:user.phone_number',
    'read:user.phone_number',
    'write:user.email',
    'read:user.email',
    'read:user.profile',
    'write:user.profile',
    'write:user.password',
  ];

  const generateQs = (params: {
    client_id?: string;
    response_type: string;
    scope: string;
    redirect_uri?: string;
    prompt: string;
  }) => {
    const newParams = new URLSearchParams(params).toString();
    if (!newParams) return '';
    return '?' + newParams;
  };

  const params = {
    client_id: CLIENT_ID,
    response_type: 'code',
    scope: scopes.join(' '),
    redirect_uri: AUTH_REDIRECT_URI,
    prompt: 'login',
  };

  const qs = generateQs(params);
  const sign = AUTH_URL + '/auth' + qs;

  return sign;
};

export const getDocTypeConverted = (docType: string) => {
  if (!docType || docType === 'Select document type') {
    return '';
  }

  return docType === 'Driving license' ? 'DRIVING_LICENSE' : 'IDENTITY_CARD';
};

export const getCurrencyPairs = (pair: string) => (pair ? pair.split('/') : ['', '']);

export const getCryptoCurrencyLogo = (currencies: any, currency: string) => {
  const icon = currencies.find(({ code }) => code.toLowerCase() === currency)?.icon;
  return icon?.replace('https://static.bxlend.com/', '') ?? '';
};

export const getChange24 = (p: string | null) => (p ? parseFloat(p) : 0);

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.:#-])[A-Za-z\d@$!%*?&.:#-]{8,}$/;
  return passwordRegex.test(password);
};

export const PASSWORD_VALIDATION_ERROR = `Password must contain a capital letter, a number, and a special character (£, &, :, .,
  @) and have at least 8 characters`;

export const KYC_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  CANCELED: 'CANCELED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
};

export const VERIFY_ACCOUNT_MESSAGES = {
  PENDING: 'Your KYC data is under consideration.',
  VERIFIED: 'You verified your KYC data.',
  CANCELED: 'You KYC data verification failed.',
  UNVERIFIED: 'Verify your account in a few minutes.',
};

export const getColor = (status) => {
  if (!status) {
    return '#828282';
  }

  if (status === KYC_STATUS.PENDING) {
    return 'yellow';
  }

  if (status === KYC_STATUS.VERIFIED) {
    return '#20BF55';
  }

  return 'red';
};

export const SOCIAL_MEDIAS = ['Facebook', 'Linkedin', 'Twitter', 'Youtube'];

export const WALLET_BUTTON_TITLES = [
  'Deposit',
  'Withdraw',
  // 'Send',
  // 'Transfer',
  'Transaction History',
];

export const ALL_FAV_BTNS: string[] = ['All', 'Favourites'];

export const mobileNavLists = [
  {
    title: 'Market',
    link: '/market',
    Icon: BsGraphUpArrow,
  },
  {
    title: 'Presale',
    link: '/presale',
    Icon: LuDollarSign,
  },
  {
    title: 'Trade',
    link: '/trade?pair=btc-usdt',
    Icon: PiPlusMinusBold,
  },
  {
    title: 'Dashboard',
    link: ROUTE_DASHBOARD,
    Icon: LuLayoutDashboard,
  },
  {
    title: 'Orders',
    link: `${ROUTE_ORDERS}${ROUTE_OPEN_ORDERS}`,
    Icon: MdBorderColor,
  },
  {
    title: 'Wallet',
    link: ROUTE_WALLET,
    Icon: BsWalletFill,
  },
];

export const SORT_DROPDOWN_OPTIONS = [
  { label: 'Name', filter: 'name' },
  { label: 'Price', filter: 'price' },
  { label: '24h Change', filter: 'change' },
];

export const getOrdersType = (pathname: string) => {
  if (pathname === `${ROUTE_ORDERS}/open-orders`) return 'OPEN_ORDER';
  return pathname === `${ROUTE_ORDERS}/order-history` ? 'ORDER_HISTORY' : 'TRADE_HISTORY';
};

export const SPOTLIGHT_INFO_ITEMS = [
  {
    label: 'Estimated value',
    value: '0 USDT',
  },
  {
    label: 'Price',
    value: '0.00025',
  },
  {
    label: 'Purchase amount',
    value: '0 ZRT',
  },
  {
    label: 'Bonus',
    value: '0 ZRT',
  },
  {
    label: 'Amount including bonus',
    value: '0 ZRT',
  },
];

export const SPOTLIGHT_CHECKBOX_LIST_ITEMS = [
  {
    text: 'I agree with the token purchasing terms.',
    link: 'View terms',
  },
  {
    text: 'I am not a citizen of one of the',
    link: 'countries listed.',
  },
  {
    text: 'I understand that purchased tokens will be distributed according to the',
    link: 'vesting schedule.',
  },
];

export const SPOTLIGHT_IMAGES = [
  LogoSpotlight,
  Mission,
  Intro,
  IntroPartTwo,
  CryptoEconomy,
  Background,
  SaleDetails,
  TokenDestribution,
  Roadmap,
  Team,
  TeamPartTwo,
  TeamPartThree,
];

export const FAQ_DATA = [
  {
    question: 'What is a cryptocurrency exchange?',
    answer:
      'Cryptocurrency exchanges are digital marketplaces that enable users to buy and sell cryptocurrencies like Bitcoin, Ethereum, and Tether.',
  },
  {
    question: 'What products does BxLend provide?',
    answer:
      'BxLend is a cryptocurrency exchange offering low fees, 100+ cryptocurrencies, staking options, and more.',
  },
  {
    question: 'How to buy Bitcoin and other cryptocurrencies on BxLend?',
    answer:
      'You can use credit/debit cards or cash balances to purchase crypto. Identity verification is required.',
  },
  {
    question: 'How to track cryptocurrency prices?',
    answer: 'Track prices, trading volumes, and more using the BxLend Cryptocurrency Directory.',
  },
  {
    question: 'How to trade cryptocurrencies on BxLend?',
    answer:
      'Trade hundreds of cryptocurrencies via Spot, Margin, Futures, and Options markets after registration and verification.',
  },
  {
    question: 'How to earn from crypto on BxLend?',
    answer:
      'Earn rewards by staking more than 100+ cryptocurrencies, including Bitcoin and Ethereum, on BxLend’s platform.',
  },
];

export const MARKET_PRESALE_TRADE = [
  {
    route: ROUTE_MARKET,
    text: 'Market',
  },
  {
    route: ROUTE_PRESALE,
    text: 'Presale',
  },
  {
    route: '/trade?pair=btc-usdt',
    text: 'Trade',
  },
];

export const extractValues = (headers: string[], items: { [key: string]: any }[]): any[][] => {
  return items.map((item) => headers.map((header) => item[header] || null));
};

export const shortenString = (str: string, startLength = 5, endLength = 5): string => {
  if (!str?.length || str.length <= startLength + endLength) {
    return str;
  }
  const start = str.slice(0, startLength);
  const end = str.slice(-endLength);
  return `${start}...${end}`;
};

export const formatFieldString = (field: string): string => {
  return field
    .split('.')
    .map((part) => part.replace(/_/g, ' ').replace(/^./, (match) => match.toUpperCase()))
    .join(' ');
};

export const handleCopy = async (message: string) => {
  try {
    await navigator.clipboard.writeText(message);
    const alert = document.getElementById('copied-alert');
    if (alert) {
      alert.style.display = 'block';
      setTimeout(() => {
        alert.style.display = 'none';
      }, 3000);
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
  }
};

export const formatNumberWithSpaces = (number: number | string) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const calculateAmountPlusDiscount = (
  amount: number,
  discounts: { minimum_buy: number; discount: number },
) => {
  if (amount >= discounts[0].minimum_buy && amount < discounts[1].minimum_buy) {
    return +amount + discounts[0].minimum_buy * discounts[0].discount;
  }

  if (amount >= discounts[1].minimum_buy && amount < discounts[2].minimum_buy) {
    return +amount + discounts[1].minimum_buy * discounts[1].discount;
  }

  if (amount >= discounts[2].minimum_buy && amount < discounts[3].minimum_buy) {
    return +amount + discounts[2].minimum_buy * discounts[2].discount;
  }

  if (amount >= discounts[3].minimum_buy) {
    return +amount + discounts[3].minimum_buy * discounts[3].discount;
  }

  return +amount;
};
