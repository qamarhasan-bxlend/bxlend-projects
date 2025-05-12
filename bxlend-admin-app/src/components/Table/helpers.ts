import { AUTH_URL } from 'src/configs';
import request from 'src/request';

export const extractRequiredFields = (data: any, fields: string[]) => {
  if (!Array.isArray(data) || data.length === 0 || !Array.isArray(fields) || fields.length === 0) return [];

  return data.map((obj) =>
    fields.reduce((acc, field) => {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(field)) {
        if (typeof field === 'boolean') {
          // @ts-expect-error Fix type
          acc[field] = obj[field].toString();
        }
        if (field === 'created_at') {
          // @ts-expect-error Fix type
          acc[field] = convertDate(obj[field]);
        } else {
          // @ts-expect-error Fix type
          acc[field] = obj[field];
        }
      }
      return acc;
    }, {})
  );
};

export const convertDate = (str: string) => {
  const dateObj = new Date(str);
  const date = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const time = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return { date, time };
};

export const shortenString = (str: string, startLength = 5, endLength = 5): string => {
  if (!str?.length || str.length <= startLength + endLength) {
    return str;
  }
  const start = str.slice(0, startLength);
  const end = str.slice(-endLength);
  return `${start}...${end}`;
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

export const formatFieldString = (field: string): string => {
  return field
    .split('.')
    .map((part) => part.replace(/_/g, ' ').replace(/^./, (match) => match.toUpperCase()))
    .join(' ');
};

export const TYPES_LIST = ['kyc', 'bank-accounts', 'waiting-list-users', 'users', 'orders', 'transactions', 'wallets'];

export const dataTypes = {
  kyc: 'kyc',
  users: 'users',
  orders: 'orders',
  transactions: 'transactions',
  'bank-accounts': 'bank_accounts',
  'waiting-list-users': 'waitingListUsers',
  wallets: 'wallets',
};

export const fetchData = (page: number, type: string, fields: string[]) =>
  request.get(`${AUTH_URL}/v1/admin/${type}?limit=10&page=${page}`).then(({ data }) => {
    return {
      data: extractRequiredFields(
        // @ts-expect-error: Specify type
        data[TYPES_LIST.includes(type) ? dataTypes[type] : data],
        fields
      ),
      total_count: data.meta.total_count,
    };
  });

export const extractStrings = (obj: any) => {
  const result = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result.push([key, value]);
    }
  }

  return result;
};

export const CONVERT_FIELD = (f: string) => {
  switch (f) {
    case 'Name':
      return 'name';
    case 'Email Status':
      return 'status';
    case 'Status':
      return 'status';
    case 'KYC Status':
      return 'kyc_status';
    case 'Country Code':
      return 'country_code';
    case 'Email':
      return 'email';
    case 'Address':
      return 'address';
    case 'Direction':
      return 'direction';
    case 'Kind':
      return 'kind';
    case 'Pair':
      return 'pair_symbol';
    case 'Recipient Address':
      return 'recipient_address';
    case 'ID':
      return '_id';
    case 'Crypto ID':
      return 'crypto_api_transaction_request_id';
    case 'Currency Code':
      return 'currency_code';
    case 'Owner ID':
      return 'owner';
    case 'User':
      return 'user';
    case 'Order No':
      return 'order_number';
    case 'Blockchain':
      return 'blockchain';
    case 'BXT Base Price':
      return 'bxt_base_price';
    case 'Payment Coin':
      return 'coin';
    case 'Wallet ID':
      return '_id';
  }

  return '';
};

export const getEntityType = (path: string) => {
  switch (path) {
    case '/admin/waiting-list-users':
      return 'waitingListUsers';
    case '/admin/orders':
      return 'orders';
    case '/admin/transactions':
      return 'transactions';
    case '/admin/users':
      return 'users';
    case '/admin/bank-account':
      return 'bank_accounts';
    case '/admin/kyc':
      return 'kyc';
    case '/admin/wallets':
      return 'wallets';
  }
};

export const getEntityFields = (path: string) => {
  switch (path) {
    case '/admin/waiting-list-users':
      return ['name', 'email', '_id', 'status', 'country_code', 'address'];
    case '/admin/orders':
      return ['id', 'direction', 'pair', 'kind', 'status', 'created_at'];
    case '/admin/transactions':
      return ['id', 'currency', 'kind', 'recipient_address', 'status', 'crypto_api_transaction_request_id'];
    case '/admin/users':
      return ['name', 'email', 'id', 'kyc_status', 'created_at'];
    case '/admin/bank-account':
      return [];
    case '/admin/kyc':
      return ['name', 'user_id', '_id', 'status', 'country_code', 'address'];
    case '/admin/wallets':
      return ['id', 'owner', 'address', 'currency', 'balance'];
  }

  return [];
};

export const getRoute = (path: string) => {
  switch (path) {
    case '/admin/waiting-list-users':
      return 'waiting-list-users';
    case '/admin/orders':
      return 'orders';
    case '/admin/transactions':
      return 'transactions';
    case '/admin/users':
      return 'users';
    case '/admin/bank-account':
      return 'bank-accounts';
    case '/admin/kyc':
      return 'kyc';
    case '/admin/wallets':
      return 'wallets';
  }

  return '';
};

export const hasOnlySpaces = (text: string) => {
  const regexp = /^\s*$/;
  return regexp.test(text) && text !== '';
};
