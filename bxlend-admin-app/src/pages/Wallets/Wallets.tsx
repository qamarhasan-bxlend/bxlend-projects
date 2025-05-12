import React, { useEffect, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { useSelector } from 'react-redux';

import { Loader } from 'src/components/Loader';
import { Table } from 'src/components/TableNew';
import PageHeader from 'src/components/PageHeader';
import NoResult from 'src/components/NoResult/NoResult';

import { WALLETS_HEADERS } from 'src/utils/constants';
import { fetchWallets, updateField, updateSearch } from 'src/store/slice/wallets';

const Wallets = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const {
    data: { wallets, totalCount, totalPages, field, search },
    loading,
  } = useSelector(({ wallets }) => wallets);

  useEffect(() => {
    dispatch(fetchWallets({ page: currentPage, field, search }));
  }, [currentPage]);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <>
      <PageHeader
        title="Wallets"
        subtitle={`You have a total of ${totalCount} wallets`}
        dropdownTitle={WALLETS_HEADERS[0]}
        dropDownItems={['Wallet ID', 'Owner ID', 'Currency Code']}
        entity="wallets"
        fetchEntity={fetchWallets}
        updateEntityField={updateField}
        updateEntitySearch={updateSearch}
      />
      {wallets?.length ? (
        <Table
          headers={WALLETS_HEADERS}
          items={wallets}
          detailsModalTitle="Wallet"
          columns="1fr 1fr 1fr 1fr 1fr"
          fieldsToShow={['id', 'owner', 'owner_type', 'currency', 'balance']}
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

export default Wallets;
