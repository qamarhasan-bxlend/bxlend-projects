/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { FiUserCheck } from 'react-icons/fi';

import { RootState } from 'src/store/store';
import { useDispatch } from 'src/store/useDispatch';
import { fetchNotificationsCount } from 'src/store/slice/notificationsCount';
import { fetchTickers } from 'src/store/slice/tickers';
import { fetchWalletAddresses } from 'src/store/slice/walletAddresses';

import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';
import { Loader } from 'src/components/Loader';
import { FadeInSection } from 'src/components/FadeInSection';
import { ReferralModal } from 'src/components/ReferralModal';
import TopMarketTable from './components/TopMarketTable';
import RecentTransactionTable from './components/RecentTransactionTable';
import Badge from 'src/components/StatusBadge/Badge';

import { setIsDashboardBalanceVisible } from 'src/store/slice/dashboardBalance';
import { ROUTE_ACCOUNT_CREATED, ROUTE_DEPOSIT, ROUTE_WITHDRAW } from 'src/routes';
import { KYC_STATUS } from 'src/constants';

import './index.css';

export type IWallet = {
  balance: string;
  currency: string;
  kind: string;
  owner: string;
  owner_type: string;
};

export type IUser = {
  name: {
    first: string;
    last: string;
  };
  id: string;
  kyc_status: string;
};

const Dashboard = () => {
  const [fiatUsdBalance, setFiatUsd] = useState(0.01);
  const [cryptoUsdBalance, setCryptoUsd] = useState(0.01);
  const [hkdUsd, setHkdUsd] = useState();
  const [isReferralModalOpen, setisReferralModalOpen] = useState(false);

  const { tickers, loading } = useSelector((state: RootState) => state.tickers);
  const { walletAddresses } = useSelector(({ walletAddresses }) => walletAddresses);
  const { isDark } = useSelector(({ isDark }) => isDark);
  const { isDashboardBalanceVisible } = useSelector(
    ({ isDashboardBalanceVisible }) => isDashboardBalanceVisible,
  );
  const {
    user: { email_verified, twoFA_verified, kyc_status, name, id },
    loading: userLoading,
  } = useSelector((state: RootState) => state.user);

  const token = localStorage.getItem('access');
  const dispatch = useDispatch();

  const toggleShowBalance = () => {
    dispatch(setIsDashboardBalanceVisible());
  };

  const navigate = useNavigate();

  const calculateUSD = (currency: string, balance: string) => {
    const lastValue = tickers.find((data) => data.pair === `${currency.toUpperCase()}/USD`)?.last;
    if (lastValue) {
      return parseFloat(balance) * parseFloat(String(lastValue));
    }
    return 0;
  };

  const handleVerificationBeforeNavigate = (path: string) => {
    const missingVerifications: string[] = [];

    if (!email_verified) {
      missingVerifications.push('email');
    }
    if (!twoFA_verified) {
      missingVerifications.push('2FA');
    }
    if (kyc_status !== KYC_STATUS.VERIFIED) {
      missingVerifications.push('KYC');
    }

    const url = missingVerifications.length === 0 ? `${path}/BTC` : ROUTE_ACCOUNT_CREATED;

    const hasMissingVerifications = missingVerifications.length === 0;

    const payload = {
      message: `Verify your ${missingVerifications.join(
        ', ',
      )} to use deposit and withdrawal services`,
    };

    const state = hasMissingVerifications ? null : payload;

    navigate(url, { state });
  };

  const getAllBalance = () => {
    let fiat = 0.0;
    let crypto = 0.0;
    walletAddresses.forEach(({ kind, currency, balance }) => {
      if (kind === 'CRYPTO') {
        crypto += calculateUSD(currency, balance);
      } else if (kind === 'FIAT') {
        if (currency === 'HKD') {
          // @ts-expect-error expected
          fiat += parseFloat(balance) * parseFloat(hkdUsd?.last || '0');
        } else {
          fiat += parseFloat(balance);
        }
      }
    });
    setCryptoUsd(crypto);
    setFiatUsd(fiat);
  };

  useEffect(() => {
    if (!tickers.length) {
      dispatch(fetchTickers());
    } else {
      const hkdUsdPair = tickers.find((data) => data.pair === 'HKD/USD');
      // @ts-expect-error expected
      setHkdUsd(hkdUsdPair);
    }

    if (!walletAddresses.length) {
      dispatch(fetchWalletAddresses());
    }

    if (token) {
      dispatch(fetchNotificationsCount());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (walletAddresses.length > 0 && tickers?.length > 0) {
      getAllBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddresses, tickers]);

  if (loading || userLoading) {
    return <Loader overlay />;
  }

  return (
    <>
      <div>
        <div className="d-lg-flex dashboard-basic-info">
          <FadeInSection
            $transitionTime={0.4}
            $className="col-lg-6 col-12 dashboard-user-info d-flex justify-content-center align-items-center p-3 gap-4 mb-4"
          >
            <div className="d-flex justify-content-center align-items-center p-3 gap-4 mb-4">
              <>
                <FiUserCheck size="3rem" fill={isDark ? '#fff' : '#172A4F'} />
                <div className="d-flex flex-column ps-2">
                  {name ? (
                    <div className="dashboard-user-name h2">{`${name?.first ?? ''} ${
                      name?.last ?? ''
                    }`}</div>
                  ) : null}
                  <div className="d-flex align-items-center py-3">
                    <div>User Id:</div>
                    <Container marginLeft={30}>{id}</Container>
                  </div>
                  <div className="d-flex">
                    <div>KYC Verification Status:</div>
                    <div className="ms-5">
                      {kyc_status === KYC_STATUS.VERIFIED || kyc_status === KYC_STATUS.PENDING ? (
                        <Badge value={kyc_status} />
                      ) : (
                        'Please submit your information to get approved link:'
                      )}
                      {kyc_status !== KYC_STATUS.VERIFIED && kyc_status !== KYC_STATUS.PENDING && (
                        <Link to="/account-created" className="ms-2">
                          Account created
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </>
            </div>
          </FadeInSection>
          <FadeInSection
            $transitionTime={0.4}
            $className={`col-lg-6 col-12 dashboard-total-balance justify-content-between p-4 ms-lg-4 mt-lg-0 mt-sm-4 my-4 ${
              isDark ? 'isDark' : ''
            }`}
          >
            <div className="d-flex align-items-center">
              <div className="d-flex flex-column w-100">
                <div className="d-flex justify-content-between align-items-center">
                  <Container fontSize="1.75rem">Total Balance</Container>
                  {/* <div
                className={`d-none dashboard-total-balance-dropdown dropdown px-2 mb-2 ms-5 ${
                  isDark ? 'isDark' : ''
                }`}
              >
                <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown">
                  Deposit
                </button>
                <Dropdown>
                  <li>
                    <button className="dropdown-item">Deposit</button>
                  </li>
                  <li>
                    <button className="dropdown-item">Withdraw</button>
                  </li>
                </Dropdown>
              </div> */}
                </div>
                <div className="d-flex align-items-center">
                  <div className="light-color-font">USD Balance</div>
                  <Button
                    text={
                      isDashboardBalanceVisible ? (
                        <AiFillEyeInvisible width="1.25rem" height="1.25rem" />
                      ) : (
                        <AiFillEye width="1.25rem" height="1.25rem" />
                      )
                    }
                    type="text"
                    onClick={toggleShowBalance}
                  />
                </div>
                <div className="h1">
                  {isDashboardBalanceVisible
                    ? `${(fiatUsdBalance + cryptoUsdBalance).toFixed(3)} USD`
                    : '*** *** ***'}
                </div>
                <div className="light-color-font">Wallet ID: 2QVT7C0LOWEJ</div>
              </div>
              <div className="dashboard-balance-btn-group d-flex flex-column gap-4 justify-content-between">
                <Button
                  $fullWidth
                  text="Deposit"
                  onClick={() => handleVerificationBeforeNavigate(ROUTE_DEPOSIT)}
                />
                <Button
                  text="Withdraw"
                  type="outlined"
                  onClick={() => handleVerificationBeforeNavigate(ROUTE_WITHDRAW)}
                />
                <Button text="Referral" $fullWidth onClick={() => setisReferralModalOpen(true)} />
              </div>
            </div>
          </FadeInSection>
        </div>
        <div className="d-lg-flex">
          <div
            className={`col-lg-7 col-12 dashboard-top-market d-flex align-items-center py-3 px-4 ${
              isDark ? 'isDark' : ''
            }`}
          >
            <TopMarketTable tableData={tickers} />
          </div>
          <div
            className={`col-lg-5 col-12 dashboard-recent-transactions d-flex py-3 px-4 ms-lg-4 mt-lg-0 mt-sm-4 mt-4 ${
              isDark ? 'isDark' : ''
            }`}
          >
            <RecentTransactionTable />
          </div>
        </div>
      </div>
      {isReferralModalOpen && <ReferralModal onClose={() => setisReferralModalOpen(false)} />}
    </>
  );
};

export default Dashboard;
