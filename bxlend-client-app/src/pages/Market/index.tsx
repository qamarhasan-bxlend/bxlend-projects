import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'src/store/store';
import { useDispatch } from 'src/store/useDispatch';
import { fetchTickers } from 'src/store/slice/tickers';
import { fetchNotificationsCount } from 'src/store/slice/notificationsCount';
import { fetchCurrencyPairs } from 'src/store/slice/currencyPairs';

import { Loader } from 'src/components/Loader';
import Table from './components/Table';

import './index.css';

const Market = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('access');

  const { tickers, loading } = useSelector((state: RootState) => state.tickers);
  const { pairs } = useSelector(({ pairs }) => pairs);

  useEffect(() => {
    if (token) {
      dispatch(fetchNotificationsCount());
    }

    if (!tickers.length) {
      dispatch(fetchTickers());
    }

    if (!pairs.length) {
      dispatch(fetchCurrencyPairs());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pairs.length, tickers.length]);

  if (loading) {
    return <Loader overlay />;
  }

  return <Table tickers={tickers} />;
};

export default Market;
