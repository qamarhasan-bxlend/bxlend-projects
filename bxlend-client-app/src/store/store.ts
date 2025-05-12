import { configureStore } from '@reduxjs/toolkit';
import currencies from './slice/currencies';
import presale from './slice/presale';
import presaleUser from './slice/presaleUser';
import notificationsCount from './slice/notificationsCount';
import countries from './slice/countries';
import user from './slice/user';
import myReferrals from './slice/userReferral';
import appAlert from './slice/appAlert';
import pairs from './slice/currencyPairs';
import tickers from './slice/tickers';
import walletAddresses from './slice/walletAddresses';
import orders from './slice/orders';
import isDark from './slice/theme';
import isDashboardBalanceVisible from './slice/dashboardBalance';
import isWalletBalanceVisible from './slice/walletBalance';

const store = configureStore({
  reducer: {
    currencies,
    presale,
    presaleUser,
    notificationsCount,
    countries,
    user,
    myReferrals,
    appAlert,
    pairs,
    tickers,
    walletAddresses,
    orders,
    isDark,
    isDashboardBalanceVisible,
    isWalletBalanceVisible,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
