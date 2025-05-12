import { configureStore } from '@reduxjs/toolkit';
import currencies from './slice/currencies';
import notificationsCount from './slice/notificationsCount';
import withdrawCount from './slice/withdrawCount';
import depositCount from './slice/depositCount';
import user from './slice/user';
import appAlert from './slice/appAlert';
import pairs from './slice/currencyPairs';
import tickers from './slice/tickers';
import walletAddresses from './slice/walletAddresses';
import settings from './slice/settings';
import dashboardCount from './slice/dashboardCount';
import entities from './slice/entities';
import waitingListUsers from './slice/waitingList';
import transactions from './slice/transactions';
import kyc from './slice/kyc';
import wallets from './slice/wallets';
import users from './slice/users';
import orders from './slice/orders';
import bankAccounts from './slice/bankAccounts';
import presaleOrders from './slice/presaleOrders';
import presaleUsers from './slice/presaleUsers';
import presaleToken from './slice/presaleToken';
import isDark from './slice/theme';

const store = configureStore({
  reducer: {
    currencies,
    notificationsCount,
    withdrawCount,
    depositCount,
    user,
    appAlert,
    pairs,
    tickers,
    walletAddresses,
    settings,
    dashboardCount,
    entities,
    waitingListUsers,
    transactions,
    kyc,
    wallets,
    users,
    orders,
    bankAccounts,
    presaleOrders,
    presaleUsers,
    presaleToken,
    isDark,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
