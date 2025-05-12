import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/useDispatch';

import { RootState } from 'src/store/store';
import { fetchNotificationsCount } from 'src/store/slice/notificationsCount';
import { fetchUser } from 'src/store/slice/user';
import { setAppAlert } from 'src/store/slice/appAlert';
import { fetchTickers } from 'src/store/slice/tickers';
import { fetchCurrencies } from 'src/store/slice/currencies';

import { Container } from 'src/components/Container';
import { Loader } from 'src/components/Loader';
import TradeStatus from './components/TradeStatus';
import MyTrade from './components/MyTrade';
import Chart from './components/Chart';
import Spot from './components/Spot';
import OrdersTabs from './components/OrderTabs';
import MobileChart from './components/MobileChart';
import CurrenciesSlider from 'src/components/CurrenciesSlider';

import * as process from 'process';
import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { ITradeData } from 'src/interfaces';

import './index.css';

const Trade = () => {
  const [kycStatus, setKycStatus] = useState('');
  const [symbol, setSymbol] = useState('');
  const [activeButton, setActiveButton] = useState('buy');
  const [ordersCount, setOrdersCount] = useState(0);
  const [offers, setOffers] = useState([]);
  const [bids, setBids] = useState([]);
  const [lastPrice, setLastPrice] = useState('0');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [marketTradeData, setMarketTrade] = useState<ITradeData[]>([]);
  const [newMarketData, setNewMarketData] = useState<ITradeData | undefined>();
  const [loadingTickers, setLoadingTickers] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const token = localStorage.getItem('access');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { isDark } = useSelector(({ isDark }) => isDark);
  const { tickers } = useSelector((state: RootState) => state.tickers);
  const { currencies } = useSelector((state: RootState) => state.currencies);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const symbolFromURL = urlParams.get('pair');
    if (symbolFromURL !== null) {
      setSymbol(symbolFromURL);
    }

    if (token) {
      dispatch(fetchNotificationsCount());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (symbol) {
      const newSocket1 = new WebSocket(`${process.env.REACT_APP_BITSTAMP_WEBSOCKET_URL}`);
      const newSocket2 = new WebSocket(`${process.env.REACT_APP_BITSTAMP_WEBSOCKET_URL}`);
      const currencies = symbol.split('-');
      const currency1 = currencies[0] || 'btc';
      const currency2 = currencies[1] || 'usdt';

      setLoadingTickers(true);
      setLoadingTransactions(true);

      request
        .get(`${PUBLIC_URL}/v1/tickers/${currency1.toUpperCase()}-${currency2.toUpperCase()}`)
        .then((response) => {
          const data = response.data;
          setLastPrice(data.ticker.to);
        })
        .catch((response) => {
          dispatch(
            setAppAlert({
              message: response?.data?.error || 'Something went wrong.',
              isSuccess: false,
            }),
          );
          navigate('/');
        })
        .finally(() => {
          setLoadingTickers(false);
          setLoadingTransactions(false);
        });

      request
        .get(`${PUBLIC_URL}/v1/market-trades/${currency1.toLowerCase() + currency2.toLowerCase()}`)
        .then((response) => {
          const data = response.data;
          setMarketTrade(data.splice(0, 15));
        })
        .catch(({ response }) => {
          dispatch(
            setAppAlert({
              message: response?.data?.error || 'Something went wrong.',
              isSuccess: false,
            }),
          );
        })
        .finally(() => {
          setLoadingTickers(false);
          setLoadingTransactions(false);
        });

      const connectSocketOrderBook = () => {
        newSocket1.addEventListener('open', () => {
          const message = {
            event: 'bts:subscribe',
            data: {
              channel: `order_book_${currency1.toLowerCase() + currency2.toLowerCase()}`,
            },
          };
          newSocket1.send(JSON.stringify(message));
        });

        newSocket1.addEventListener('message', (event) => {
          const newData = JSON.parse(event.data);
          setOffers(newData.data.asks);
          setBids(newData.data.bids);
        });
      };

      const connectSocketLiveTrades = () => {
        newSocket2.addEventListener('open', () => {
          const message = {
            event: 'bts:subscribe',
            data: {
              channel: `live_trades_${currency1.toLowerCase() + currency2.toLowerCase()}`,
            },
          };
          newSocket2.send(JSON.stringify(message));
        });

        newSocket2.addEventListener('message', (event) => {
          const newData = JSON.parse(event.data);
          if (Object.keys(newData.data).length !== 0) {
            setNewMarketData(newData.data);
          }
        });
      };

      connectSocketLiveTrades();
      connectSocketOrderBook();

      return () => {
        newSocket1.close();
        newSocket2.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  useEffect(() => {
    if (newMarketData) {
      const temp = marketTradeData;
      temp.unshift(newMarketData);
      setMarketTrade(temp.slice(0, 15));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMarketData]);

  useEffect(() => {
    const isUserFetched = Object.keys(user).length;
    const token = localStorage.getItem('access');

    if (isUserFetched) {
      setKycStatus(user.kyc_status.toUpperCase());
      return;
    }

    if (!isUserFetched && token) {
      dispatch(fetchUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!tickers.length) {
      dispatch(fetchTickers());
    }

    if (!currencies.length) {
      dispatch(fetchCurrencies());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickers, currencies]);

  useEffect(() => {
    if (lastPrice !== '0') {
      const currencies = symbol.split('-');
      const currency1 = currencies[0] || 'btc';
      const currency2 = currencies[1] || 'usdt';
      const newSocket = new WebSocket(`${process.env.REACT_APP_BITSTAMP_WEBSOCKET_URL}`);
      const connectSocket = () => {
        newSocket.addEventListener('open', () => {
          const message = {
            event: 'bts:subscribe',
            data: {
              channel: `live_trades_${currency1.toLowerCase() + currency2.toLowerCase()}`,
            },
          };
          newSocket.send(JSON.stringify(message));
        });

        newSocket.addEventListener('message', (event) => {
          const newData = JSON.parse(event.data);
          if (newData.data.price_str !== undefined) {
            setUpdatedPrice(newData.data.price_str);
          }
        });
      };

      connectSocket();

      return () => {
        newSocket.close();
      };
    }
  }, [lastPrice, symbol]);

  if (loadingTickers || loadingTransactions) {
    return <Loader overlay />;
  }

  return (
    <>
      <div className="d-flex">
        <div className="col-4 d-lg-flex d-none flex-column">
          <TradeStatus
            offers={offers}
            bids={bids}
            lastPrice={lastPrice}
            updatedPrice={updatedPrice}
          />
          <MyTrade myTradeData={marketTradeData} />
        </div>
        <div className="col-lg-8 col-12 d-flex flex-column">
          <Chart symbol={symbol} />
          <div className="h-100 trade-chart mobile-trade-chart ms-lg-3 ms-0 mb-3">
            <ul className="nav nav-pills trade-spot-tab trade-chart-tab" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="pill"
                  href="#chart"
                  style={{ color: isDark ? '#fff' : '#172a4f' }}
                >
                  Chart
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="pill"
                  href="#order-book"
                  style={{ color: isDark ? '#fff' : '#172a4f' }}
                >
                  Order Book
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="pill"
                  href="#trades"
                  style={{ color: isDark ? '#fff' : '#172a4f' }}
                >
                  Trades
                </a>
              </li>
            </ul>
            <div className="tab-content h-100">
              <div id="chart" className="container tab-pane active h-100 px-0 pb-5">
                <MobileChart symbol={symbol} />
              </div>
              <div id="order-book" className="container tab-pane fade">
                <MyTrade myTradeData={marketTradeData} />
              </div>
              <div id="trades" className="container tab-pane fade">
                <TradeStatus
                  offers={offers}
                  bids={bids}
                  lastPrice={lastPrice}
                  updatedPrice={updatedPrice}
                />
              </div>
            </div>
          </div>
          <div className="d-lg-none d-flex justify-content-between mt-3 trade-status-mobile mb-3">
            <div className="col-6 h-100">
              <TradeStatus
                offers={offers}
                bids={bids}
                lastPrice={lastPrice}
                updatedPrice={updatedPrice}
              />
            </div>
            <div className="col-6 ms-2 me-2 h-100">
              <MyTrade myTradeData={marketTradeData} />
            </div>
          </div>
          <Spot
            activeButton={activeButton}
            setActiveButton={setActiveButton}
            setOrdersCount={setOrdersCount}
            kycStatus={kycStatus}
          />
        </div>
      </div>
      <OrdersTabs ordersCount={ordersCount} key={ordersCount} kycStatus={kycStatus} />
      <Container margin="3rem 0 -3rem">
        <CurrenciesSlider currencies={currencies} tickers={tickers} />
      </Container>
    </>
  );
};

export default Trade;
