import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';
import { Table } from 'src/components/Table';
import { Loader } from 'src/components/Loader';
import { Button } from 'src/components/Button';
import CancelTrx from './CancelModal';
import ConfirmTrx from './ConfirmModal';
import NoResult from 'src/components/NoResult/NoResult';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { setAppAlert } from 'src/store/slice/appAlert';
import { useDispatch } from 'src/store/useDispatch';
import { fetchPresale } from 'src/store/slice/presale';

const PresaleTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [trxToCancel, setTrxToCancel] = useState<any>(null);
  const [trxToConfirm, setTrxToConfirm] = useState<any>(null);
  const [transactions, setTransactions] = useState([]);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [blockchainTrxId, setBlockchainTrxId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();

  const { presale, loading: presaleLoading } = useSelector(({ presale }) => presale);

  const isLoading = loading || presaleLoading;

  const fetchTransactions = () => {
    setLoading(true);

    request
      .get(`${PUBLIC_URL}/presale/client/presale-transaction?page=${currentPage}&limit=10`)
      .then(({ data }) => {
        setTransactions(data?.presale_transactions);
        setTotalPages(data?.meta?.page_count);
      })
      .catch(({ response }) => {
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong.',
            isSuccess: false,
          }),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const confirmTransaction = () => {
    if (!receipt) {
      dispatch(
        setAppAlert({
          message: 'Please upload a receipt before confirming the transaction.',
          isSuccess: false,
        }),
      );
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('blockchain_transaction_id', blockchainTrxId);
    formData.append('transaction_id', trxToConfirm._id);
    formData.append('presale_transaction', receipt);

    request
      .put(`${PUBLIC_URL}/presale/client/presale-transaction`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        dispatch(
          setAppAlert({
            message: 'You have confirmed order',
            isSuccess: true,
          }),
        );
        setTimeout(() => {
          fetchTransactions();
        }, 100);
      })
      .catch(({ response }) => {
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong.',
            isSuccess: false,
          }),
        );
      })
      .finally(() => {
        setTrxToConfirm(null);
        setLoading(false);
        setBlockchainTrxId('');
      });
  };

  const cancelTransaction = () => {
    setLoading(true);

    request
      .put(`${PUBLIC_URL}/presale/client/presale-transaction/cancel`, {
        transaction_id: trxToCancel._id,
      })
      .then(() => {
        dispatch(
          setAppAlert({
            message: 'You have cancelled order',
            isSuccess: true,
          }),
        );
        setTimeout(() => {
          fetchTransactions();
        }, 100);
      })
      .catch(({ response }) => {
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong.',
            isSuccess: false,
          }),
        );
      })
      .finally(() => {
        setTrxToCancel(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (!presale) {
      dispatch(fetchPresale());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loader overlay />;
  }

  return (
    <>
      <Glass>
        <Container textAlign="center" fontSize="1.25rem" paddingBottom="1.25rem">
          This table shows all types and status of orders
        </Container>
        <Glass>
          {transactions?.length ? (
            <Table
              headers={[
                'Order NO',
                'Amount USD',
                'Converted Price',
                'Tokens',
                'Payment Coin',
                'Status',
                'Blockchain',
              ]}
              // @ts-expect-error asd
              // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
              items={transactions.map(({ user: { id: _, ...userRest }, ...rest }) => {
                const order_number = rest.transaction_number;

                delete userRest.kyc_status;
                delete userRest.birthdate;
                delete rest.payment_screenshot;
                delete rest.transaction_number;

                const depositAddress = presale?.supported_payment_options?.find(
                  ({ blockchain }) => blockchain === rest?.blockchain_name,
                )?.deposit_address;

                return {
                  order_number,
                  ...rest,
                  ...userRest,
                  name: userRest?.name?.first
                    ? `${userRest?.name?.first} ${userRest?.name?.last}`
                    : null,
                  user_id: userRest.id,
                  status: rest.status,
                  amount_in_usd: `$${rest.amount_in_usd}`,
                  bxlend_token_base_price: `$${rest.bxlend_token_base_price}`,
                  coin_price: `$${rest.coin_price}`,
                  coin_converted_price: `${rest.coin_converted_price} ${rest.payment_coin}`,
                  deposit_address: depositAddress,
                  token_allocation: `${rest.token_allocation} BXT`,
                };
              })}
              columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
              detailsModalTitle="Order"
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              isPresaleOrder
              fieldsToShow={[
                'order_number',
                'amount_in_usd',
                'coin_converted_price',
                'token_allocation',
                'payment_coin',
                'status',
                'blockchain_name',
              ]}
              actions={(item) => {
                if (item.status === 'pending') {
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
          <Container display="grid" gridTemplateColumns="repeat(8, 1fr)" gap="0px"></Container>
        </Glass>
      </Glass>
      {trxToCancel && (
        <CancelTrx
          onCancel={cancelTransaction}
          onClose={() => setTrxToCancel(null)}
          trx={trxToCancel}
        />
      )}
      {trxToConfirm && (
        <ConfirmTrx
          onConfirm={confirmTransaction}
          onClose={() => setTrxToConfirm(null)}
          receipt={receipt}
          blockchainTrxId={blockchainTrxId}
          setBlockchainTrxId={setBlockchainTrxId}
          setReceipt={setReceipt}
          trx={trxToConfirm}
        />
      )}
    </>
  );
};

export default PresaleTransactions;
