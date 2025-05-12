import React, { useEffect, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { useSelector } from 'react-redux';

import { Loader } from 'src/components/Loader';
import { Table } from 'src/components/TableNew';
import PageHeader from 'src/components/PageHeader';
import NoResult from 'src/components/NoResult/NoResult';

import { BANK_ACCOUNTS_HEADERS } from 'src/utils/constants';
import { fetchBankAccounts, updateField, updateSearch } from 'src/store/slice/bankAccounts';

const BankAccounts = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const {
    data: { bankAccounts, totalCount, totalPages, field, search },
    loading,
  } = useSelector(({ bankAccounts }) => bankAccounts);

  useEffect(() => {
    dispatch(fetchBankAccounts({ page: currentPage, field, search }));
  }, [currentPage]);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <>
      <PageHeader
        title="Bank Accounts"
        subtitle={`You have a total of ${totalCount} bank accounts`}
        dropdownTitle={BANK_ACCOUNTS_HEADERS[0]}
        dropDownItems={['ID', 'Direction', 'Kind', 'Status', 'Pair']}
        entity="orders"
        fetchEntity={fetchBankAccounts}
        updateEntityField={updateField}
        updateEntitySearch={updateSearch}
      />
      {bankAccounts?.length ? (
        <Table
          headers={BANK_ACCOUNTS_HEADERS}
          items={bankAccounts}
          detailsModalTitle="Bank Account"
          columns="1fr 1fr 1fr 1fr 1fr 1fr"
          fieldsToShow={['account_number', 'id', 'bank_name', 'swift_bic_code', 'status', 'created_at']}
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

export default BankAccounts;
