import React, { useEffect, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { useSelector } from 'react-redux';

import { Loader } from 'src/components/Loader';
import { Table } from 'src/components/TableNew';
import PageHeader from 'src/components/PageHeader';
import NoResult from 'src/components/NoResult/NoResult';

import { ORDERS_HEADERS } from 'src/utils/constants';
import { fetchOrders, updateField, updateSearch } from 'src/store/slice/orders';

const Orders = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const {
    data: { orders, totalCount, totalPages, field, search },
    loading,
  } = useSelector(({ orders }) => orders);

  useEffect(() => {
    dispatch(fetchOrders({ page: currentPage, field, search }));
  }, [currentPage]);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle={`You have a total of ${totalCount} orders`}
        dropdownTitle={ORDERS_HEADERS[0]}
        dropDownItems={['ID', 'Direction', 'Kind', 'Status', 'Pair']}
        entity="orders"
        fetchEntity={fetchOrders}
        updateEntityField={updateField}
        updateEntitySearch={updateSearch}
      />
      {orders?.length ? (
        <Table
          headers={ORDERS_HEADERS}
          items={orders}
          detailsModalTitle="Order"
          columns="1fr 1fr 1fr 1fr 1fr 1fr"
          fieldsToShow={['id', 'direction', 'pair', 'kind', 'status', 'created_at']}
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

export default Orders;
