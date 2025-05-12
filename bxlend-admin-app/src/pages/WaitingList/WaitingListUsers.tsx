import React, { useEffect, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { useSelector } from 'react-redux';

import { Loader } from 'src/components/Loader';
import { Table } from 'src/components/TableNew';
import PageHeader from 'src/components/PageHeader';
import NoResult from 'src/components/NoResult/NoResult';

import { WAITING_LIST_HEADERS } from 'src/utils/constants';
import { fetchWaitingListUsers, updateField, updateSearch } from 'src/store/slice/waitingList';

const WaitingList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const {
    data: { waitingListUsers, totalCount, totalPages, field, search },
    loading,
  } = useSelector(({ waitingListUsers }) => waitingListUsers);

  useEffect(() => {
    dispatch(fetchWaitingListUsers({ page: currentPage, field, search }));
  }, [currentPage]);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <>
      <PageHeader
        title="Waiting List Users"
        subtitle={`You have a total of ${totalCount} waiting list orders.`}
        dropdownTitle={WAITING_LIST_HEADERS[0]}
        dropDownItems={['Name', 'Email', 'Country Code', 'Email Status', 'Address']}
        entity="waitingListUsers"
        fetchEntity={fetchWaitingListUsers}
        updateEntityField={updateField}
        updateEntitySearch={updateSearch}
      />
      {waitingListUsers?.length ? (
        <Table
          headers={WAITING_LIST_HEADERS}
          items={waitingListUsers?.map(
            ({ name: { ...userName }, address: { ...userAddress }, identification_url, ...rest }: any) => {
              delete rest.__v;

              return {
                ...rest,
                ...userAddress,
                front: identification_url?.front,
                back: identification_url?.back,
                name: `${userName?.first} ${userName?.last}`,
              };
            }
          )}
          columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
          fieldsToShow={['name', 'email', '_id', 'status', 'country_code', 'city', 'pin_code']}
          detailsModalTitle="User"
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

export default WaitingList;
