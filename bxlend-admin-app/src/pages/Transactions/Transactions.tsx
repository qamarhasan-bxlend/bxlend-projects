import React, { useEffect, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { useSelector } from 'react-redux';

import { Loader } from 'src/components/Loader';
import { Table } from 'src/components/TableNew';
import PageHeader from 'src/components/PageHeader';
import NoResult from 'src/components/NoResult/NoResult';

import { TRANSACTIONS_HEADERS } from 'src/utils/constants';
import { fetchTransactions, updateField, updateSearch } from 'src/store/slice/transactions';

const Transactions = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const {
    data: { transactions, totalCount, totalPages, field, search },
    loading,
  } = useSelector(({ transactions }) => transactions);

  useEffect(() => {
    dispatch(fetchTransactions({ page: currentPage, field, search }));
  }, [currentPage]);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle={`You have a total of ${totalCount} transactions.`}
        dropdownTitle={TRANSACTIONS_HEADERS[0]}
        dropDownItems={['ID', 'Kind', 'Status', 'Recipient Address', 'Currency Code']}
        entity="transactions"
        fetchEntity={fetchTransactions}
        updateEntityField={updateField}
        updateEntitySearch={updateSearch}
      />
      {transactions?.length ? (
        <Table
          headers={TRANSACTIONS_HEADERS}
          items={transactions}
          detailsModalTitle="Transaction"
          columns="1fr 1fr 1fr 1fr 1fr 1fr"
          fieldsToShow={['id', 'currency', 'kind', 'recipient_address', 'status']}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <NoResult />
      )}
    </>
  );
};

export default Transactions;
