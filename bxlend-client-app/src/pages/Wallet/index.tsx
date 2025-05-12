import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Loader } from 'src/components/Loader';
import { Select } from 'src/components/Select';
import Balance from './components/Balance';
import Table from './components/Table';

import { RootState } from 'src/store/store';
import { useDispatch } from 'src/store/useDispatch';
import { fetchTickers } from 'src/store/slice/tickers';
import { setIsWalletBalanceVisible } from 'src/store/slice/walletBalance';
import {
  ROUTE_ACCOUNT_CREATED,
  ROUTE_DEPOSIT,
  ROUTE_TRANSACTIONS,
  ROUTE_WITHDRAW,
} from 'src/routes';
import { KYC_STATUS, WALLET_BUTTON_TITLES } from 'src/constants';

import './index.css';

const Wallet = () => {
  const navigate = useNavigate();
  const [btcUsd, setBtcUsd] = useState(1);
  const [fiatUsdBalance, setFiatUsd] = useState(0.01);
  const [cryptoUsdBalance, setCryptoUsd] = useState(0.01);
  const [fiatBtcBalance, setFiatBtc] = useState(0.01);
  const [cryptoBtcBalance, setCryptoBtc] = useState(0.01);

  const dispatch = useDispatch();

  const { isWalletBalanceVisible } = useSelector(
    ({ isWalletBalanceVisible }) => isWalletBalanceVisible,
  );
  const {
    user: { email_verified, twoFA_verified, kyc_status },
  } = useSelector((state: RootState) => state.user);
  const { tickers } = useSelector((state: RootState) => state.tickers);
  const { walletAddresses, walletsCount, loading } = useSelector(
    ({ walletAddresses }) => walletAddresses,
  );

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

    const url = missingVerifications.length === 0 ? path : ROUTE_ACCOUNT_CREATED;

    const hasMissingVerifications = missingVerifications.length === 0;

    const payload = {
      message: `Verify your ${missingVerifications.join(
        ', ',
      )} to use deposit and withdrawal services`,
    };

    const state = hasMissingVerifications ? null : payload;

    navigate(url, { state });
  };

  const handleNavigate = (item: string) => {
    switch (item) {
      case 'Deposit':
        handleVerificationBeforeNavigate(ROUTE_DEPOSIT);
        break;
      case 'Withdraw':
        handleVerificationBeforeNavigate(ROUTE_WITHDRAW);
        break;
      case 'Send':
        navigate('/send/btc');
        break;
      case 'Transfer':
        navigate('/transfer/btc');
        break;
      case 'Transaction History':
        navigate(ROUTE_TRANSACTIONS);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setFiatBtc(fiatUsdBalance / btcUsd);
    setCryptoBtc(cryptoUsdBalance / btcUsd);
  }, [fiatUsdBalance, cryptoUsdBalance, btcUsd]);

  useEffect(() => {
    if (!tickers.length) {
      dispatch(fetchTickers());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="d-flex flex-md-row flex-column justify-content-between align-items-center wallet-main-part mb-5">
        <div className="d-flex flex-column wallet-main-title">
          <div className="d-flex justify-content-between align-items-center px-3">
            <Container fontSize="1.75rem">Fiat and Spot Balance</Container>
            <button
              className="eye-button ms-1"
              style={{ background: 'transparent' }}
              onClick={() => dispatch(setIsWalletBalanceVisible())}
            >
              {isWalletBalanceVisible ? (
                <AiFillEyeInvisible fontSize="1.25rem" />
              ) : (
                <AiFillEye fontSize="1.25rem" />
              )}
            </button>
          </div>
          <div className="d-flex flex-column mt-3 ms-md-5 ms-0">
            <Container fontSize="1.25rem">Estimated Balance</Container>
            {loading ? (
              <Loader size={24} />
            ) : (
              <div className="d-flex">
                <div className="h5">
                  {isWalletBalanceVisible
                    ? `${(fiatBtcBalance + cryptoBtcBalance).toFixed(4)} BTC`
                    : '**************'}
                </div>
                <div className="h5 wallet-usd-balance">
                  {`~ ${
                    isWalletBalanceVisible
                      ? `$${(fiatUsdBalance + cryptoUsdBalance).toFixed(4)}`
                      : '***************'
                  }`}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex flex-column align-items-md-start align-items-center mt-md-0 mt-5">
          <div className="d-xxl-flex gap-5 d-none wallet-action-btn-group">
            {WALLET_BUTTON_TITLES.map((item, index) => (
              <Button
                key={index}
                text={item}
                type="outlined"
                onClick={() => handleNavigate(item)}
              />
            ))}
          </div>
          <div className="d-xxl-none d-block dropdown px-2">
            <Select
              options={[
                {
                  value: 'Deposit',
                  label: 'Deposit',
                },
                {
                  value: 'Withdraw',
                  label: 'Withdraw',
                },
                {
                  value: 'Transaction History',
                  label: 'Transaction History',
                },
              ]}
              value=""
              onChange={(e) => handleNavigate(e.currentTarget.value)}
            />
          </div>
          <div className="d-flex align-items-center flex-md-row flex-column mt-4 ms-2">
            <Balance
              label={'Spot'}
              btcValue={cryptoBtcBalance.toFixed(4)}
              usdValue={cryptoUsdBalance.toFixed(4)}
              isVisible={isWalletBalanceVisible}
              loading={loading}
            />
            <Balance
              label={'Fiat'}
              btcValue={fiatBtcBalance.toFixed(4)}
              usdValue={fiatUsdBalance.toFixed(4)}
              isVisible={isWalletBalanceVisible}
              loading={loading}
            />
          </div>
        </div>
      </div>
      <Table
        setCryptoUsd={setCryptoUsd}
        setFiatUsd={setFiatUsd}
        setBtcUsd={setBtcUsd}
        isVisible={isWalletBalanceVisible}
        tickers={tickers}
        walletAddresses={walletAddresses}
        walletsCount={walletsCount}
        loading={loading}
      />
      <Container height={20} />
    </div>
  );
};

export default Wallet;
