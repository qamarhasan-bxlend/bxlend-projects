import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft } from 'react-bootstrap-icons';

import { RootState } from 'src/store/store';
import { useDispatch } from 'src/store/useDispatch';
import { fetchCurrencies } from 'src/store/slice/currencies';
import { ROUTE_WALLET } from 'src/routes';

import Dropdown from 'src/components/Dropdown';
import Balance from './components/Balance';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';

import './index.css';

const WithdrawManual = () => {
  const [networks, setNetworks] = useState<string[]>([]);

  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currencies } = useSelector((state: RootState) => state.currencies);

  useEffect(() => {
    const fetchWalletAddress = (id: string) => {
      if (!id) {
        return null;
      }

      try {
        request.get(`${PUBLIC_URL}/v1/wallet_addresses/${id}`).catch((e) => {
          navigate(ROUTE_WALLET);
          console.log(e);
        });
      } catch (e) {
        console.log(e);
      }
    };

    if (!currencies.length) {
      dispatch(fetchCurrencies());
    } else {
      const activeCurrency = currencies.find((curr) => curr.code === state.code);
      if (activeCurrency?.id) {
        fetchWalletAddress(activeCurrency?.id);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    const fetchNetworks = () => {
      try {
        request
          .get(`${PUBLIC_URL}/v1/currencies/code/${state.code}`)
          .then(({ data }) => setNetworks(data.currency_code.networks));
      } catch (e) {
        console.log(e);
      }
    };

    fetchNetworks();
  }, [state.code]);

  return (
    <div className="px-lg-5 px-sm-3 position-relative">
      <div className="d-flex align-items-center mb-4">
        <a href="/wallet" className="btn">
          <ChevronLeft />
        </a>
        <div className="h2 m-0">Withdraw Fiat</div>
      </div>
      <div className="d-flex flex-md-row flex-column align-items-center justify-content-between p-sm-5 p-1 coin-wallet-info">
        <div className="col-md-8 col-12 d-flex flex-column coin-network-info">
          <div className="mb-4">
            <div className="coin-title">Select Coin</div>
            <div className="coin-list-dropdown dropdown my-2">
              <button
                type="button"
                className="btn coin-dropdown-btn dropdown-toggle px-4"
                data-bs-toggle="dropdown"
              >
                <div className="d-flex">
                  <div className="ms-2 d-flex">
                    <div className="fw-bold">{state.code}</div>
                    <div className="ms-2">{state.code}</div>
                  </div>
                </div>
                <ChevronDown />
              </button>
              <Dropdown classNames="w-100">
                {currencies.map((coin, index) => (
                  <Link key={index} to={`/withdraw/${coin.code}`} state={{ code: coin.code }}>
                    <li>
                      <button className="dropdown-item py-2">
                        <div className="d-flex">
                          <div className="ms-2 d-flex">
                            <div className="fw-bold">{coin.code}</div>
                            <div className="ms-2">{coin.name}</div>
                          </div>
                        </div>
                      </button>
                    </li>
                  </Link>
                ))}
              </Dropdown>
            </div>
          </div>
          <div>
            <div className="coin-title">Send to Network</div>
            <div className="coin-list-dropdown dropdown my-2">
              <button
                type="button"
                className="btn coin-dropdown-btn dropdown-toggle px-4"
                data-bs-toggle="dropdown"
                disabled
              >
                {!!networks && !!networks.length && (
                  <div className="d-flex">
                    <div className="fw-bold">{networks[0]}</div>
                    <div className="ms-2">{networks[0]}</div>
                  </div>
                )}
                <ChevronDown />
              </button>
              {!!networks && !!networks.length && (
                <Dropdown classNames="w-100">
                  {networks.map((network, index) => (
                    <li key={index}>
                      <button className="dropdown-item">
                        <div className="ms-2 d-flex">
                          <div className="fw-bold">{network}</div>
                          <div className="ms-2">{network}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </Dropdown>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4 col-12 d-flex flex-column wallet-address-info mt-sm-0 mt-5">
          <div className="d-flex flex-column mb-4">
            <div className="coin-title mb-3">Address</div>
            <input type="text" className="input-wallet-address p-3" placeholder="Enter Address" />
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Balance balance={'0'} />
            <Balance balance={'0.0000039 ~ 0.0002'} />
          </div>
        </div>
      </div>
      <div className="d-flex deposit-extra-info my-5 flex-sm-row flex-column">
        <div className="col-md-6 col-sm-6 col-12 deposit-faq">
          <div className="h5 mb-3">FAQ</div>
          <ul className="ps-4">
            <li>
              <a href="#" className="btn btn-link deposit-faq-item">
                Video Tutorial
              </a>
            </li>
            <li>
              <a href="#" className="btn btn-link deposit-faq-item">
                How to Deposit Crypto Step-by-step Guide
              </a>
            </li>
            <li>
              <a href="#" className="btn btn-link deposit-faq-item">
                Why has my deposit not been credited yet?
              </a>
            </li>
            <li>
              <a href="#" className="btn btn-link deposit-faq-item">
                How to buy crypto and get started on BxLend
              </a>
            </li>
            <li>
              <a href="#" className="btn btn-link deposit-faq-item">
                Deposit & Withdrawal status query.
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WithdrawManual;
