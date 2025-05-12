import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Table } from 'src/components/Table';
import { Loader } from 'src/components/Loader';
import NoResult from 'src/components/NoResult/NoResult';
import Dropdown from 'src/components/Dropdown';

import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { ROUTE_TRANSACTIONS } from 'src/routes';
import { ALL_FAV_BTNS } from 'src/constants';

export type ITransaction = {
  id: string;
  created_at: Date;
  quantity: string;
  status: string;
  currency: string;
};

const RecentTransactionsTable = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    request
      .get(`${PUBLIC_URL}/v1/transactions?page=${currentPage}&limit=5`)
      .then(({ data }) => {
        const sortedTransactions = data.transactions.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setTransactions(sortedTransactions);
        setTotalPages(data?.meta?.page_count);
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
  }, [dispatch, currentPage]);

  return (
    <>
      <Container
        display="flex"
        flexDirection="column"
        justifyContent={loading ? 'center' : 'space-between'}
        width="100%"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          {!loading && (
            <>
              <Container fontSize="1.75rem">Recent Transactions</Container>
              <div className="d-flex dashboard-recent-trans-dropdown dropdown px-2">
                <Button onClick={() => navigate(ROUTE_TRANSACTIONS)} text="View All" />
                <Dropdown>
                  {ALL_FAV_BTNS.map((filterButton, index) => (
                    <li key={index}>
                      <button className="dropdown-item">{filterButton}</button>
                    </li>
                  ))}
                </Dropdown>
              </div>
            </>
          )}
        </div>
        {loading ? (
          <Loader size={100} />
        ) : transactions?.length ? (
          <Table
            headers={['Date', 'Wallet ID', 'Amount', 'Status']}
            columns="1fr 1fr 1fr 1fr"
            isTransaction
            currentPage={currentPage}
            totalPages={totalPages}
            items={transactions.slice(0, 5)}
            setCurrentPage={setCurrentPage}
            detailsModalTitle="Transaction"
            fieldsToShow={['created_at', 'id', 'quantity', 'status']}
          />
        ) : (
          <Container margin="auto 0">
            <NoResult />
          </Container>
        )}
      </Container>
    </>
  );
};

export default RecentTransactionsTable;
