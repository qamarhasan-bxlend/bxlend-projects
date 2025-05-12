// import { ReactComponent as Dashboard } from 'src/assets/images/Dashboard.svg';
// import { ReactComponent as Withdraw } from 'src/assets/images/Withdraw.svg';
import { ReactComponent as Metrics } from 'src/assets/images/Metrics.svg';
import { ReactComponent as Circle } from 'src/assets/images/Circle.svg';
import { ReactComponent as Graphics } from 'src/assets/images/Graphics.svg';

import { PiHandDeposit } from 'react-icons/pi';
import { IoWalletOutline } from 'react-icons/io5';
import { FaUsers } from 'react-icons/fa';
import { CiCircleList } from 'react-icons/ci';
import { GrTransaction } from 'react-icons/gr';
import { MdOutlineAccountBalance } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { FaUserCheck } from 'react-icons/fa6';
import { AiOutlineTransaction } from 'react-icons/ai';
import { FaUserEdit } from 'react-icons/fa';
import { MdGeneratingTokens } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';
import { LuNetwork } from 'react-icons/lu';

export const SIDEBAR_BUTTONS = [
  // { text: 'Dashboard', url: 'dashboard', img: Dashboard },
  { text: 'Deposit', url: 'deposit', img: PiHandDeposit },
  // { text: 'Withdraw', url: 'withdraw', img: Withdraw },
  { text: 'Wallets', url: 'wallets', img: IoWalletOutline },
  { text: 'Users', url: 'users', img: FaUsers },
  { text: 'Orders', url: 'orders', img: CiCircleList },
  { text: 'Transactions', url: 'transactions', img: GrTransaction },
  { text: 'Bank Accounts', url: 'bank-account', img: MdOutlineAccountBalance },
  { text: 'KYC', url: 'kyc', img: FaUserCircle },
  { text: 'Waiting List', url: 'waiting-list-users', img: FaUserCheck },
  { text: 'Presale Orders', url: 'presale-orders', img: AiOutlineTransaction },
  { text: 'Presale Users', url: 'presale-users', img: FaUserEdit },
  { text: 'Presale Token', url: 'presale-token', img: MdGeneratingTokens },
  { text: 'Cron Jobs', url: 'cron-jobs', img: LuNetwork },
  { text: 'Settings', url: 'settings', img: IoSettingsOutline },
];

export const RECENT_ACTIVITY_HEADERS = ['Activity ID', 'Amount', 'Date', 'Status'];

export const RECENT_ACTIVITY_DATA = [
  {
    activity: {
      id: 'DY04210S0XA5',
      hash: 'Hash: 2111853732263042',
    },
    date: 'May 23, 2022',
    amount: '$250.00',
    status: 'Completed',
  },
  {
    activity: {
      id: 'DY04210S0XA5',
      hash: 'Hash: 2111853732263042',
    },
    date: 'May 23, 2022',
    amount: '$250.00',
    status: 'Completed',
  },
  {
    activity: {
      id: 'DY04210S0XA5',
      hash: 'Hash: 2111853732263042',
    },
    date: 'May 23, 2022',
    amount: '$250.00',
    status: 'Completed',
  },
  {
    activity: {
      id: 'DY04210S0XA5',
      hash: 'Hash: 2111853732263042',
    },
    date: 'May 23, 2022',
    amount: '$250.00',
    status: 'Completed',
  },
  {
    activity: {
      id: 'DY04210S0XA5',
      hash: 'Hash: 2111853732263042',
    },
    date: 'May 23, 2022',
    amount: '$250.00',
    status: 'Completed',
  },
  {
    activity: {
      id: 'DY04210S0XA5',
      hash: 'Hash: 2111853732263042',
    },
    date: 'May 23, 2022',
    amount: '$250.00',
    status: 'Completed',
  },
];

export const PRICES = [
  { id: 1, name: 'BTC', subname: 'Bitcoin', price: '10$' },
  { id: 2, name: 'ETH', subname: 'Ethereum', price: '1230$' },
  { id: 3, name: 'USDT', subname: 'TetherUS', price: '44.1231$' },
  { id: 4, name: 'BNB', subname: 'BNB', price: '11230$' },
  { id: 5, name: 'XRP', subname: 'Ripple', price: '1230$' },
  { id: 6, name: 'ADA', subname: 'Cardano', price: '88420$' },
  { id: 7, name: 'BUSD', subname: 'BUSD', price: '110$' },
  { id: 8, name: 'MATIC', subname: 'Polygon', price: '11230$' },
  { id: 9, name: 'DOGE', subname: 'Degocoin', price: '510$' },
  { id: 10, name: 'SOL', subname: 'Solana', price: '1000$' },
];

export const WIDGETS = [
  { id: 1, title: 'User activity', subtitle: 'You have total 99 users.', type: 'users', img: Metrics },
  { id: 2, title: 'Orders', subtitle: 'You have total 389 orders.', type: 'orders', img: Circle },
  { id: 3, title: 'Transactions', subtitle: 'You have total 389 transactions.', type: 'transactions', img: Metrics },
  { id: 4, title: 'Bank accounts', subtitle: 'You have total 389 bank accounts.', type: 'bank-accounts', img: Circle },
  { id: 5, title: 'KYC', subtitle: 'You have total 389 KYC.', type: 'kyc', img: Graphics },
];

export const USERS_HEADERS = ['Full name', 'Email', 'Status', 'ID', 'KYC Status', 'Created at'];

export const KYC_HEADERS = ['Full name', 'ID', 'Status', 'Country Code', 'Address'];

export const WAITING_LIST_HEADERS = ['Full name', 'Email', 'ID', 'Email Status', 'Country Code', 'City', 'Pin Code'];

export const BANK_ACCOUNTS_HEADERS = ['Account number', 'ID', 'Bank name', 'Swift BIC Code', 'Status', 'Created at'];

export const PRESALE_ORDERS_HEADERS = [
  'id',
  'Order No',
  'Status',
  'Blockchain',
  'BXT Base Price',
  'Payment Coin',
  'Stage',
  'Tokens',
  'Amount USD',
];

export const PRESALE_USERS_HEADERS = [
  'ID',
  'Referral Reward',
  'Total Allocation',
  'Pending Allocation',
  'Email',
  'KYC Status',
  'Name',
  'Created At',
];

export const CRON_JOBS_HEADERS = ['Name', 'Description'];

export const TRANSACTIONS_HEADERS = ['ID', 'Currency Code', 'Kind', 'Recipient Address', 'Status'];

export const ORDERS_HEADERS = ['ID', 'Direction', 'Pair', 'Kind', 'Status', 'Created at'];

export const WITHDRAWALS_HEADERS = ['ID', 'Type', 'Currency', 'Status', 'Actions'];

export const WITHDRAWALS_DATA = [
  {
    user_id: 'DY04210S0XA5',
    type: 'Manual',
    currency: 'HKD',
    status: 'PENDING',
  },
  {
    user_id: 'DY04210S0XA5',
    type: 'Manual',
    currency: 'HKD',
    status: 'PENDING',
  },
  {
    user_id: 'DY04210S0XA5',
    type: 'Manual',
    currency: 'HKD',
    status: 'PENDING',
  },
  {
    user_id: 'DY04210S0XA5',
    type: 'Manual',
    currency: 'HKD',
    status: 'PENDING',
  },
  {
    user_id: 'DY04210S0XA5',
    type: 'Manual',
    currency: 'HKD',
    status: 'PENDING',
  },
  {
    user_id: 'DY04210S0XA5',
    type: 'Manual',
    currency: 'HKD',
    status: 'PENDING',
  },
  {
    user_id: 'DY04210S0XA5',
    type: 'Manual',
    currency: 'HKD',
    status: 'PENDING',
  },
];

export const WALLETS_HEADERS = ['ID', 'Owner', 'Owner Type', 'Currency', 'Balance'];
