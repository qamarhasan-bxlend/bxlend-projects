import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  ROUTE_ADMIN,
  ROUTE_ADMIN_BASE,
  ROUTE_AUTH_CALLBACK,
  ROUTE_BANK_ACCOUNT,
  // ROUTE_DASHBOARD,
  ROUTE_KYC,
  ROUTE_LOGIN,
  ROUTE_ORDERS,
  ROUTE_TRANSACTIONS,
  ROUTE_USERS,
  ROUTE_WALLETS,
  // ROUTE_WITHDRAW,
  ROUTE_DEPOSIT,
  ROUTE_SETTINGS,
  ROUTE_WAITING_LIST,
  ROUTE_PRESALE_ORDERS,
  ROUTE_PRESALE_TOKEN,
  ROUTE_PRESALE_USERS,
  ROUTE_CRON_JOBS,
} from './utils/routes';

import { Container } from 'src/components/Container';
import MainLayout from 'src/components/MainLayout';
import Notification from 'src/components/Notification';

import LogIn from './pages/LogIn';
import CallbackPage from './pages/Callback';
// import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Kyc from './pages/Kyc';
import BankAccounts from './pages/BankAccounts';
import Transactions from './pages/Transactions';
import Orders from './pages/Orders';
// import Withdrawals from './pages/Withdrawals';
import Wallets from './pages/Wallets';
import Deposit from './pages/Deposit';
import Settings from './pages/Settings';
import WaitingList from './pages/WaitingList';
import Home from './pages/Home/Home';
import PresaleTransactions from './pages/PresaleOrders';
import PresaleTokens from './pages/PresaleToken';
import PresaleUsers from './pages/PresaleUsers';
import CronJobs from './pages/CronJobs';

const App = () => {
  const navigate = useNavigate();

  const { message, isSuccess } = useSelector(({ appAlert }) => appAlert);

  useEffect(() => {
    const access = localStorage?.getItem('access');
    if (!access) {
      navigate(ROUTE_LOGIN);
    }

    const handleClickOutsideSidebar = (event: MouseEvent) => {
      const inputBurger = document.getElementById('input-burger');
      const burgerMenu = document.getElementById('burger-menu');
      const sidebar = document.getElementById('sidebar');

      if (
        inputBurger &&
        // @ts-expect-error NOTE: Expected warning.
        inputBurger.checked &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        burgerMenu &&
        !burgerMenu.contains(event.target as Node)
      ) {
        burgerMenu.click();
      }
    };

    document.addEventListener('click', handleClickOutsideSidebar);

    return () => {
      document.removeEventListener('click', handleClickOutsideSidebar);
    };
  }, [navigate]);

  return (
    <Container height="100vh" display="flex" flexDirection="column">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={ROUTE_LOGIN} element={<LogIn />} />
        <Route path={ROUTE_AUTH_CALLBACK} element={<CallbackPage />} />
        <Route path={ROUTE_ADMIN_BASE} element={<MainLayout />} />
        <Route path={ROUTE_ADMIN}>
          {/* <Route path={ROUTE_DASHBOARD} element={<MainLayout Component={Dashboard} />} /> */}
          <Route path={ROUTE_USERS} element={<MainLayout Component={Users} />} />
          <Route path={ROUTE_KYC} element={<MainLayout Component={Kyc} />} />
          <Route path={ROUTE_WAITING_LIST} element={<MainLayout Component={WaitingList} />} />
          <Route path={ROUTE_PRESALE_ORDERS} element={<MainLayout Component={PresaleTransactions} />} />
          <Route path={ROUTE_PRESALE_TOKEN} element={<MainLayout Component={PresaleTokens} />} />
          <Route path={ROUTE_PRESALE_USERS} element={<MainLayout Component={PresaleUsers} />} />
          <Route path={ROUTE_CRON_JOBS} element={<MainLayout Component={CronJobs} />} />
          <Route path={ROUTE_BANK_ACCOUNT} element={<MainLayout Component={BankAccounts} />} />
          <Route path={ROUTE_TRANSACTIONS} element={<MainLayout Component={Transactions} />} />
          <Route path={ROUTE_ORDERS} element={<MainLayout Component={Orders} />} />
          {/* <Route path={ROUTE_WITHDRAW} element={<MainLayout Component={Withdrawals} />} /> */}
          <Route path={ROUTE_WALLETS} element={<MainLayout Component={Wallets} />} />
          <Route path={ROUTE_DEPOSIT} element={<MainLayout Component={Deposit} />} />
          <Route path={ROUTE_SETTINGS} element={<MainLayout Component={Settings} />} />
        </Route>
      </Routes>
      {message && <Notification message={message} isSuccess={isSuccess} />}
    </Container>
  );
};

export default App;
