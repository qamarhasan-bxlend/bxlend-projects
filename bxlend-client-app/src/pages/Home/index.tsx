import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/useDispatch';
import { RootState } from 'src/store/store';
import { fetchCurrencyPairs } from 'src/store/slice/currencyPairs';
import { fetchTickers } from 'src/store/slice/tickers';
import { fetchNotificationsCount } from 'src/store/slice/notificationsCount';
import { fetchCurrencies } from 'src/store/slice/currencies';
import { ITableData } from 'src/interfaces';

import { Container } from 'src/components/Container';
import HelpSection from './components/HelpSection';
import Join from './components/Join';
import Main from './components/Main';
import Portfolio from './components/Portfolio';
import Table from './components/Table';
import StartToday from './components/Start';
import OurSocials from './components/OurSocials';
import Footer from './components/Footer';
import CurrenciesSlider from 'src/components/CurrenciesSlider';

import './index.css';

const Home = () => {
  const token = localStorage.getItem('access');

  const dispatch = useDispatch();

  const { pairs } = useSelector(({ pairs }) => pairs);
  const { tickers } = useSelector((state: RootState) => state.tickers);
  const { user } = useSelector((state: RootState) => state.user);
  const { currencies } = useSelector((state: RootState) => state.currencies);

  useEffect(() => {
    if (pairs && tickers) {
      const resultTableData = pairs
        ?.map(({ currencies }) => {
          const pair = `${currencies[0]}/${currencies[1]}`;
          return tickers.find((item) => item.pair === pair);
        })
        .filter(Boolean);

      if (resultTableData) {
        const temp: ITableData[] | undefined = [];
        resultTableData.forEach((result) => {
          if (result) {
            temp.push(result);
          }
        });
      }
    }
  }, [pairs, tickers]);

  useEffect(() => {
    if (!pairs.length) {
      dispatch(fetchCurrencyPairs());
    }

    if (!tickers.length) {
      dispatch(fetchTickers());
    }

    if (!currencies.length) {
      dispatch(fetchCurrencies());
    }

    if (token) {
      dispatch(fetchNotificationsCount());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Main />
      <div>
        <OurSocials />
        <Table pairs={pairs} tickers={tickers} />
        <Container height="2rem" />
        <CurrenciesSlider currencies={currencies} tickers={tickers} />
        <Portfolio />
        <Join />
        <HelpSection />
        <StartToday user={user} />
      </div>
      <Footer />
    </>
  );
};

export default Home;
