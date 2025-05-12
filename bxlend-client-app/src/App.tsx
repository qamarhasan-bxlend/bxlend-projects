import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { fetchUser } from './store/slice/user';
import { useDispatch } from './store/useDispatch';
import { setAppAlert } from './store/slice/appAlert';
import { theme } from './theme';

import Home from './pages/Home';
import Header from './pages/Home/components/Header';
import Market from './pages/Market';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Signup from './pages/Signup';
import Wallet from './pages/Wallet';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Trade from './pages/Trade';
import Transactions from './pages/Transactions';
import Authentication from './pages/Authentication';
import AccountCreated from './pages/AccountCreated/AccountCreated';
import EnterEmail from './pages/EnterEmail/EnterEmail';
import NotificationsPage from './pages/Notifications';
import DepositManual from './pages/DepositManual';
import WithdrawManual from './pages/Withdraw-Manual';
import ManualTransaction from './pages/ManualTransaction';
import SecurityVerification from './pages/SecurityVerification/SecurityVerification';
import EnterPhone from './pages/EnterPhone/EnterPhone';
import Notification from 'src/components/Notification/Notification';
import Spotlight from './pages/Spotlight/Spotlight';
import Settings from './pages/Settings';
import TermOfUse from './pages/TermOfUse';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ChangePassword from './pages/ChangePassword';
import RequestRtp from './pages/RequestOtp';
import SubmitRtp from './pages/SubmitOtp';
import EarlyRegistration from './pages/EarlyRegistration';
import Presale from './pages/Presale';
import BuyTokens from './pages/BuyTokens';
import PresaleTransactions from './pages/PresaleTransactions';
import FAQ from './pages/FAQ';

import {
  ROUTE_AUTH_CALLBACK,
  ROUTE_MARKET,
  ROUTE_SIGNUP,
  ROUTE_TRADE,
  ROUTE_SPOTLIGHT,
  ROUTE_TERMS_OF_USE,
  ROUTE_ABOUT_US,
  ROUTE_PRIVACY_POLICY,
  ROUTE_FORGOT_PW_REQUEST_OTP,
  ROUTE_FORGOT_PW_SUBMIT_OTP,
  ROUTE_EARLY_REGISTRATION,
  ROUTE_FAQ,
  ROUTE_ACCOUNT_CREATED,
  ROUTE_CHANGE_PW,
  ROUTE_DASHBOARD,
  ROUTE_DEPOSIT_ALL,
  ROUTE_DEPOSIT_MANUAL,
  ROUTE_DEPOSIT_MANUAL_CODE,
  ROUTE_EMAIL_VERIFICATION,
  ROUTE_UPDATE_PHONE,
  ROUTE_NOTIFICATIONS,
  ROUTE_ORDERS_ALL,
  ROUTE_SECURITY_VERIFICATION,
  ROUTE_SETTINGS,
  ROUTE_TRANSACTIONS_ALL,
  ROUTE_WALLET,
  ROUTE_WITHDRAW_ALL,
  ROUTE_WITHDRAW_MANUAL,
  ROUTE_WITHDRAW_MANUAL_CODE,
  ROUTE_PRESALE,
  ROUTE_BUY_TOKEN,
  ROUTE_PRESALE_ORDERS,
} from './routes';
import { Container } from './components/Container';

const Wrap = ({ children }) => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return <div className={`container-fluid${isDark ? ' isDark ' : ''}`}>{children}</div>;
};

const Footer = () => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <Container
      fontSize="0.9rem"
      textAlign="center"
      marginTop="3rem"
      paddingTop="1rem"
      borderTop={`1px solid ${isDark ? '#423e3e' : '#f2f2f2'}`}
    >
      Copyright © 2025 BxLend. finance All Rights reserved.
    </Container>
  );
};

const App = () => {
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { message, isSuccess } = useSelector(({ appAlert }) => appAlert);

  useEffect(() => {
    const handleStorageEvent = () => {
      if (!token) {
        navigate('/');
        dispatch(setAppAlert({ message: 'Your session has expired. Please log in again.' }));
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [navigate, dispatch, token]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [token, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Wrap>
        <Header />
        <Container flexGrow={1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path={ROUTE_AUTH_CALLBACK} element={<Authentication />} />
            <Route path={ROUTE_MARKET} element={<Market />} />
            <Route path={ROUTE_SIGNUP} element={<Signup />} />
            <Route path={ROUTE_TRADE} element={<Trade />} />
            <Route path={ROUTE_SPOTLIGHT} element={<Spotlight />} />
            <Route path={ROUTE_TERMS_OF_USE} element={<TermOfUse />} />
            <Route path={ROUTE_ABOUT_US} element={<AboutUs />} />
            <Route path={ROUTE_PRIVACY_POLICY} element={<PrivacyPolicy />} />
            <Route path={ROUTE_FORGOT_PW_REQUEST_OTP} element={<RequestRtp />} />
            <Route path={ROUTE_FORGOT_PW_SUBMIT_OTP} element={<SubmitRtp />} />
            <Route path={ROUTE_EARLY_REGISTRATION} element={<EarlyRegistration />} />
            <Route path={ROUTE_FAQ} element={<FAQ />} />
            <Route path={ROUTE_PRESALE} element={<Presale />} />

            {/* Protected routes. Only Authed users can access. */}
            {token && (
              <>
                <Route path={ROUTE_DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTE_WALLET} element={<Wallet />} />
                <Route path={ROUTE_ORDERS_ALL} element={<Orders />} />
                <Route path={ROUTE_UPDATE_PHONE} element={<EnterPhone />} />
                <Route path={ROUTE_ACCOUNT_CREATED} element={<AccountCreated />} />
                <Route path={ROUTE_SECURITY_VERIFICATION} element={<SecurityVerification />} />
                <Route path={ROUTE_EMAIL_VERIFICATION} element={<EnterEmail />} />
                <Route path={ROUTE_NOTIFICATIONS} element={<NotificationsPage />} />
                <Route path={ROUTE_WITHDRAW_MANUAL} element={<WithdrawManual />} />
                <Route path={ROUTE_WITHDRAW_MANUAL_CODE} element={<ManualTransaction />} />
                <Route path={ROUTE_DEPOSIT_MANUAL} element={<DepositManual />} />
                <Route path={ROUTE_DEPOSIT_MANUAL_CODE} element={<ManualTransaction />} />
                <Route path={ROUTE_DEPOSIT_ALL} element={<Deposit />} />
                <Route path={ROUTE_WITHDRAW_ALL} element={<Withdraw />} />
                <Route path={ROUTE_TRANSACTIONS_ALL} element={<Transactions />} />
                <Route path={ROUTE_SETTINGS} element={<Settings />} />
                <Route path={ROUTE_CHANGE_PW} element={<ChangePassword />} />
                <Route path={ROUTE_BUY_TOKEN} element={<BuyTokens />} />
                <Route path={ROUTE_PRESALE_ORDERS} element={<PresaleTransactions />} />
              </>
            )}

            {/* Catch non-existing routes. */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
        {message && <Notification message={message} isSuccess={isSuccess} />}
        <Footer />
      </Wrap>
    </ThemeProvider>
  );
};

export default App;
