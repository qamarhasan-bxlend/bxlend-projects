import React, { useEffect, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { useSelector } from 'react-redux';
import { fetchPresaleOrders, updateField, updateSearch } from 'src/store/slice/presaleOrders';

import { Loader } from 'src/components/Loader';
import { Table } from 'src/components/TableNew';
import PageHeader from 'src/components/PageHeader';
import NoResult from 'src/components/NoResult/NoResult';

import { PRESALE_ORDERS_HEADERS } from 'src/utils/constants';
import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';
import request from 'src/request';
import { setAppAlert } from 'src/store/slice/appAlert';
import { AUTH_URL } from 'src/configs';
import CancelTrx from './CancelModal';
import ConfirmTrx from './ConfirmModal';

const PresaleOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [trxToCancel, setTrxToCancel] = useState<any>(null);
  const [trxToConfirm, setTrxToConfirm] = useState<any>(null);
  const [trxOperationLoading, setTrxOperationLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    data: { presaleOrders, totalCount, totalPages, field, search },
    loading,
  } = useSelector(({ presaleOrders }) => presaleOrders);

  const confirmTransaction = () => {
    setTrxOperationLoading(true);

    request
      .put(`${AUTH_URL}/presale/admin/presale-transaction/confirm`, { transaction_id: trxToConfirm._id })
      .then(() => {
        dispatch(
          setAppAlert({
            message: 'You have confirmed order',
            isSuccess: true,
          })
        );
        setTimeout(() => {
          dispatch(fetchPresaleOrders({ page: currentPage, field, search }));
        }, 100);
      })
      .catch(() => {
        dispatch(
          setAppAlert({
            message: 'Something went wrong',
            isSuccess: false,
          })
        );
      })
      .finally(() => {
        setTrxToConfirm(null);
        setTrxOperationLoading(false);
      });
  };

  const cancelTransaction = () => {
    setTrxOperationLoading(true);

    request
      .put(`${AUTH_URL}/presale/admin/presale-transaction/reject`, {
        transaction_id: trxToCancel._id,
      })
      .then(() => {
        dispatch(
          setAppAlert({
            message: 'You have canceled order',
            isSuccess: true,
          })
        );
        setTimeout(() => {
          dispatch(fetchPresaleOrders({ page: currentPage, field, search }));
        }, 100);
      })
      .catch(() => {
        dispatch(
          setAppAlert({
            message: 'Something went wrong',
            isSuccess: false,
          })
        );
      })
      .finally(() => {
        setTrxToCancel(null);
        setTrxOperationLoading(false);
      });
  };

  useEffect(() => {
    dispatch(fetchPresaleOrders({ page: currentPage, field, search }));
  }, [currentPage]);

  if (loading || trxOperationLoading) {
    return <Loader overlay />;
  }

  return (
    <>
      <PageHeader
        title="Presale Orders"
        subtitle={`You have a total of ${totalCount} presale orders`}
        entity="presaleOrders"
        fetchEntity={fetchPresaleOrders}
        updateEntityField={updateField}
        updateEntitySearch={updateSearch}
        dropdownTitle={PRESALE_ORDERS_HEADERS[0]}
        dropDownItems={['Order No', 'Status', 'Blockchain', 'BXT Base Price', 'Payment Coin']}
      />
      {presaleOrders?.length ? (
        <Table
          headers={PRESALE_ORDERS_HEADERS}
          items={presaleOrders.map(({ order_number, ...rest }: any) => ({
            order_number,
            ...rest,
            amount_in_usd: `$${rest.amount_in_usd}`,
            bxlend_token_base_price: `$${rest.bxlend_token_base_price}`,
            coin_price: `$${rest.coin_price}`,
            token_allocation: `${rest.token_allocation} BXT`,
            coin_converted_price: `$${rest.coin_converted_price}`,
          }))}
          columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
          detailsModalTitle="Order"
          fieldsToShow={[
            '_id',
            'order_number',
            'status',
            'blockchain',
            'bxlend_token_base_price',
            'payment_coin',
            'presale_stage',
            'token_allocation',
            'amount_in_usd',
          ]}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          actions={(item) => {
            if (item.status === 'in_progress') {
              return (
                <Container display="flex" flexDirection="column" gap="0.5rem">
                  <Button
                    text="Cancel"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTrxToCancel(item);
                    }}
                    $fullWidth
                    styles={{
                      background: '#DC3545',
                    }}
                  />
                  <Button
                    text="Confirm"
                    $fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      setTrxToConfirm(item);
                    }}
                  />
                </Container>
              );
            }
          }}
        />
      ) : (
        <NoResult />
      )}
      {trxToCancel && <CancelTrx onCancel={cancelTransaction} onClose={() => setTrxToCancel(null)} trx={trxToCancel} />}
      {trxToConfirm && (
        <ConfirmTrx onConfirm={confirmTransaction} onClose={() => setTrxToConfirm(null)} trx={trxToConfirm} />
      )}
    </>
  );
};

export default PresaleOrders;
