import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';

import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';
import { Table } from 'src/components/Table';
import { Loader } from 'src/components/Loader';
import Tabs from './Tabs/Tabs';
import Tab from './Tabs/Tab/Tab';

import { PUBLIC_URL } from 'src/configs';
import { KYC_STATUS, getSign } from 'src/constants';
import request from 'src/request';
import NoResult from 'src/components/NoResult/NoResult';

const OrdersTabs = ({ ordersCount, kycStatus }) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [fulfilledOrders, setFulfilledOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('Open orders');

  const dispatch = useDispatch();

  const accessToken = localStorage.getItem('access');
  const sign = getSign();

  useEffect(() => {
    const fetchOrders = () => {
      setIsLoading(true);
      try {
        request
          .get(`${PUBLIC_URL}/v1/orders?page=${currentPage}&limit=10`)
          .then(({ data }) => {
            setActiveTab(data?.orders[0]?.status === 'PENDING' ? 'Open orders' : 'Order history');
            setActiveOrders(data?.orders?.filter(({ status }) => status === 'PENDING'));
            setFulfilledOrders(
              data?.orders?.filter(({ status }) => status === 'ACTIVE' || status === 'FULFILLED'),
            );
            setTotalPages(data?.meta?.page_count);
          })
          .catch(({ response }) =>
            dispatch(
              setAppAlert({
                message: response?.data?.error || 'Something went wrong',
                isSuccess: false,
              }),
            ),
          )
          .finally(() => setIsLoading(false));
      } catch (e) {
        console.log(e);
      }
    };

    if (accessToken) {
      fetchOrders();
    } else {
      dispatch(
        setAppAlert({
          message: 'You are logged out',
          isSuccess: false,
        }),
      );
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordersCount, currentPage, accessToken, dispatch]);

  useEffect(() => {
    const access = localStorage?.getItem('access');
    setIsLoggedIn(!!access);
  }, []);

  if (isLoading) {
    return <Loader overlay />;
  }

  return (
    <div className="position-relative">
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeOrdersLength={activeOrders.length}
        isLoggedIn={isLoggedIn}
        isKycVerified={kycStatus === KYC_STATUS.VERIFIED}
      >
        <Tab label="Open orders">
          <Glass>
            {isLoggedIn && kycStatus === KYC_STATUS.VERIFIED ? (
              <>
                {activeOrders?.length ? (
                  <Table
                    headers={['Date', 'Pair', 'Type', 'Price', 'Amount', 'Status']}
                    columns="1fr 1fr 1fr 1fr 1fr 1fr"
                    items={activeOrders ?? []}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    detailsModalTitle="Order"
                    fieldsToShow={[
                      'created_at',
                      'pair',
                      'direction',
                      'executed_price',
                      'quantity',
                      'status',
                    ]}
                  />
                ) : (
                  <NoResult />
                )}
              </>
            ) : (
              <Container padding="3rem 0 2rem" textAlign="center">
                Please <a href={sign}>Login</a> to view Open orders.
              </Container>
            )}
          </Glass>
        </Tab>
        <Tab label="Order history" key={v4()}>
          <Glass>
            {isLoggedIn ? (
              <>
                {fulfilledOrders?.length ? (
                  <Table
                    headers={['Date', 'Pair', 'Type', 'Price', 'Amount', 'Status']}
                    items={fulfilledOrders ?? []}
                    columns="1fr 1fr 1fr 1fr 1fr 1fr"
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    detailsModalTitle="Order"
                    fieldsToShow={[
                      'created_at',
                      'pair',
                      'direction',
                      'executed_price',
                      'quantity',
                      'status',
                    ]}
                  />
                ) : (
                  <NoResult />
                )}
              </>
            ) : (
              <Container padding="3rem 0 2rem" textAlign="center">
                Please <a href={sign}>Login</a> to view Order history.
              </Container>
            )}
          </Glass>
        </Tab>
      </Tabs>
      {!isLoggedIn && (
        <div className="position-absolute blur-text">
          Please <a href={sign}>Login</a> to view Open orders.
        </div>
      )}
      {isLoggedIn && kycStatus !== KYC_STATUS.VERIFIED && (
        <div className="position-absolute blur-text">
          {kycStatus === KYC_STATUS.PENDING ? (
            <div>
              Your <a href="/account-created">KYC</a> is pending approval.
            </div>
          ) : (
            <div>
              Please verify the <a href="/account-created">KYC</a> to place an order.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersTabs;
