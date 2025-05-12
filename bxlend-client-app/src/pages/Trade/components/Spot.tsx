import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from 'src/store/store';
import { setAppAlert } from 'src/store/slice/appAlert';
import { useDispatch } from 'src/store/useDispatch';
import { fetchCurrencyPairs } from 'src/store/slice/currencyPairs';
import { fetchCurrencies } from 'src/store/slice/currencies';

import { Loader } from 'src/components/Loader';
import MarketBalance from './MarketBalance';
import ToggleSwitch from './ToggleSwitch';

import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { extractCurrencies, getSign, KYC_STATUS } from 'src/constants';

export type SpotProps = {
  activeButton: string;
  setActiveButton: React.Dispatch<React.SetStateAction<string>>;
  setOrdersCount: React.Dispatch<React.SetStateAction<number>>;
  kycStatus: string;
};

const Spot = ({ activeButton, setActiveButton, setOrdersCount, kycStatus }: SpotProps) => {
  const [marketValue, setMarketValue] = useState('');
  const [balance, setBalance] = useState(0);
  const [pairId, setPairId] = useState(null);
  const [pairFromPath, setPairFromPath] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { pairs } = useSelector(({ pairs }) => pairs);
  const { currencies } = useSelector((state: RootState) => state.currencies);
  // const { isDark } = useSelector(({ isDark }) => isDark);

  const token = localStorage.getItem('access');

  const isBuy = activeButton === 'buy';
  const currentCurrency = currencies.find((c) => c.code === pairFromPath[isBuy ? 1 : 0]);
  const btnTxt = isBuy ? 'BUY' : 'SELL';
  const location = useLocation();
  const accessToken = localStorage.getItem('access');

  const sign = getSign();

  const getBalance = () => {
    if (currentCurrency) {
      setLoading(true);
      request
        .get(`${PUBLIC_URL}/v1/wallet_addresses/${currentCurrency.id}`)
        .then((res) => setBalance(res.data.wallet.available_balance))
        .catch(({ response }) => {
          setBalance(0);
          dispatch(
            setAppAlert({
              message: response?.data?.error || 'Something went wrong',
              isSuccess: false,
            }),
          );
        })
        .finally(() => setLoading(false));
    }
  };

  const handleCreateOrder = async () => {
    if (isBuy && marketValue && +marketValue < 20) {
      dispatch(
        setAppAlert({
          message: 'Amount for BUY operation cannot be lower than 20.',
          isSuccess: false,
        }),
      );
      setMarketValue('');
      return null;
    }

    setLoading(true);

    request
      .post(`${PUBLIC_URL}/v1/orders/${pairId}`, {
        type: 'MARKET',
        direction: activeButton.toUpperCase(),
        amount: String(marketValue),
        currency: pairFromPath[isBuy ? 1 : 0],
      })
      .then(() => {
        dispatch(
          setAppAlert({
            message: 'Order has been succesfully created.',
            isSuccess: true,
          }),
        );
        setMarketValue('');
        setTimeout(() => setOrdersCount((prevState) => prevState + 1), 3000);
        getBalance();
      })
      .catch(({ response }) => {
        setLoading(false);
        dispatch(
          setAppAlert({
            message: response?.data?.error,
            isSuccess: false,
          }),
        );
      });
  };

  const getCurrencyPairId = () => {
    const extractedCurrencies = extractCurrencies(location.search);

    const pair = pairs.filter(
      ({ currencies }) =>
        currencies[0] === extractedCurrencies[0] && currencies[1] === extractedCurrencies[1],
    );
    if (pair[0]) {
      setPairId(pair[0].id);
    }
  };

  useEffect(() => {
    if (!pairs.length) {
      dispatch(fetchCurrencyPairs());
    }

    if (!currencies.length) {
      dispatch(fetchCurrencies());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPairFromPath(extractCurrencies(location.search));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    if (pairs.length) {
      getCurrencyPairId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs]);

  useEffect(() => {
    if (token) {
      getBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeButton, currencies, pairFromPath]);

  return (
    <div className="position-relative">
      <div
        className={`d-flex flex-column trade-spot ms-lg-3 ms-0 ${
          accessToken && kycStatus === KYC_STATUS.VERIFIED ? '' : 'blur-box'
        }`}
      >
        <div className="h2 trade-spot-title mb-0">Spot</div>
        <ul className="nav nav-pills trade-spot-tab ps-4" role="tablist">
          {/* <li className="nav-item">
            <a
              className="nav-link active"
              data-bs-toggle="pill"
              href="#market"
              style={{ color: isDark ? '#fff' : '#111' }}
            >
              Market
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-bs-toggle="pill"
              href="#limit"
              style={{ color: isDark ? '#fff' : '#111' }}
            >
              Limit
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-bs-toggle="pill"
              href="#stop-limit"
              style={{ color: isDark ? '#fff' : '#111' }}
            >
              Stop-limit
            </a>
          </li> */}
        </ul>
        <div className="tab-content ps-4">
          <div id="limit" className="container tab-pane">
            <ToggleSwitch
              activeButton={activeButton}
              setActiveButton={setActiveButton}
              loading={loading}
            />
            <div className="avbl">Avbl 0.0000000 USDT</div>
            <div className="spot-input-group input-group my-3">
              <input type="text" className="form-control" placeholder="Amount" />
              <button className="btn btn-secondary" type="button">
                DASH
              </button>
            </div>
            <div className="spot-input-group input-group my-3">
              <input type="text" className="form-control" placeholder="Price" />
              <button className="btn btn-secondary" type="submit">
                BTC
              </button>
            </div>
            <hr className="hr" />
            <button className="btn w-100 border spot-submit">PLACE LIMIT ORDER</button>
          </div>
          <div id="market" className="container tab-pane active">
            <ToggleSwitch
              activeButton={activeButton}
              setActiveButton={setActiveButton}
              loading={loading}
            />
            {!!currencies.length && pairFromPath.length && (
              <MarketBalance
                activeTab={activeButton}
                balance={balance}
                pairFromPath={pairFromPath}
                loading={loading}
              />
            )}
            <div className="spot-input-group input-group mt-3 mb-5">
              <input
                type="number"
                className="form-control"
                style={{ color: '#111' }}
                placeholder="Amount"
                value={marketValue && +marketValue >= 0 ? marketValue : ''}
                onChange={(e) => {
                  +e.currentTarget.value <= balance &&
                    +e.currentTarget.value >= 0 &&
                    setMarketValue(e.currentTarget.value);
                }}
              />
              <button
                className="btn btn-secondary"
                type="submit"
                style={{
                  pointerEvents: 'none',
                }}
              >
                {pairFromPath[isBuy ? 1 : 0]}
              </button>
            </div>
            <button
              onClick={handleCreateOrder}
              className="btn w-100 border-none spot-submit mt-3"
              disabled={loading}
              style={{
                pointerEvents: marketValue && +marketValue > 0 ? 'auto' : 'none',
                background:
                  marketValue && +marketValue > 0
                    ? 'linear-gradient(270deg, #00feb9 0%, #00fafd 100%)'
                    : '#F2F2F2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#111',
              }}
            >
              {loading ? <Loader size={20} /> : btnTxt} {loading ? null : pairFromPath[0]}
            </button>
          </div>
          <div id="stop-limit" className="container tab-pane fade">
            <ToggleSwitch
              activeButton={activeButton}
              setActiveButton={setActiveButton}
              loading={loading}
            />
            <div className="avbl">Avbl 0.0000000 USDT</div>
            <div className="spot-input-group input-group my-3">
              <input type="text" className="form-control" placeholder="Amount" />
              <button className="btn btn-secondary" type="submit">
                DASH
              </button>
            </div>
            <div className="spot-input-group input-group my-3">
              <input type="text" className="form-control" placeholder="Price" />
              <button className="btn btn-secondary" type="submit">
                BTC
              </button>
            </div>
            <hr className="hr" />
            <button className="btn w-100 border spot-submit">PLACE LIMIT ORDER</button>
          </div>
        </div>
      </div>
      {!accessToken && (
        <div className="position-absolute blur-text">
          Please <a href={sign}>Login</a> to trade.
        </div>
      )}
      {accessToken && kycStatus !== KYC_STATUS.VERIFIED && (
        <div className="position-absolute blur-text">
          {kycStatus === KYC_STATUS.PENDING ? (
            <div>
              Your <a href="/account-created">KYC</a> is pending approval.
            </div>
          ) : (
            <div>
              Please verify the <a href="/account-created">KYC</a> to place an order.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Spot;
