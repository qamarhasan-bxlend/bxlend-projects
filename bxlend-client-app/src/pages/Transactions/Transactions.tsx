import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from 'src/store/store';
import { setAppAlert } from 'src/store/slice/appAlert';
import { useDispatch } from 'src/store/useDispatch';
import { fetchCurrencies } from 'src/store/slice/currencies';

import { Loader } from 'src/components/Loader';
import Table from './components/Table';

import {
  TRANSACTIONS_CRYPTO_BTNS,
  TRANSACTIONS_CRYPTO_HEADERS,
  TRANSACTIONS_FIAT_BTNS,
  TRANSACTIONS_FIAT_HEADERS,
} from 'src/constants';
import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { ROUTE_TRANSACTIONS_FIAT } from 'src/routes';

import { StyledOrdersWrap as StyledTransactionsWrap } from './styled';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { currencies, loading: currenciesLoading } = useSelector(
    (state: RootState) => state.currencies,
  );

  const fetchTransactions = () => {
    setLoading(true);
    request
      .get(
        `${PUBLIC_URL}/v1/transactions${selectedType !== '' ? '/' : ''}${
          selectedType === '' ? '' : selectedType.toLowerCase()
        }?page=${currentPage}&limit=10`,
      )
      .then(({ data }) => {
        setPageCount(data.meta.page_count);
        setTransactions(() => {
          const sortByDateDesc = (transactions) => {
            return transactions.sort(
              (a, b) => Number(new Date(b.created_at)) - Number(new Date(a.created_at)),
            );
          };

          if (selectedType === '') {
            return sortByDateDesc(data.transactions);
          }

          return selectedType === 'Deposit'
            ? sortByDateDesc(data.deposit_transaction)
            : sortByDateDesc(data.withdraw_transaction);
        });
      })
      .catch(({ response }) =>
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong.',
            isSuccess: false,
          }),
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, currentPage]);

  useEffect(() => {
    if (!currencies.length) {
      dispatch(fetchCurrencies());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || currenciesLoading) {
    return <Loader overlay />;
  }

  return (
    <StyledTransactionsWrap>
      <Routes>
        <Route
          path="/"
          element={
            <Table
              isTransaction
              title="Transaction History"
              buttons={TRANSACTIONS_CRYPTO_BTNS}
              tableHeaders={TRANSACTIONS_CRYPTO_HEADERS}
              columns="0.75fr 0.75fr 0.75fr 1.25fr 1fr .6fr .6fr"
              transactions={transactions}
              selectedType={selectedType}
              totalPages={pageCount}
              setSelectedType={setSelectedType}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              currencies={currencies}
            />
          }
        />
        <Route
          path={ROUTE_TRANSACTIONS_FIAT}
          element={
            <Table
              isTransaction
              title="Transaction History"
              buttons={TRANSACTIONS_FIAT_BTNS}
              tableHeaders={TRANSACTIONS_FIAT_HEADERS}
              columns="1fr 1fr 1fr 1fr 1fr 1fr"
              currencies={currencies}
            />
          }
        />
      </Routes>
    </StyledTransactionsWrap>
  );
};

export default Transactions;
