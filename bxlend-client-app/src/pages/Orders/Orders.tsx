import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/useDispatch';
import { fetchNotificationsCount } from 'src/store/slice/notificationsCount';
import { fetchOrders, filterOrdersBySearch } from 'src/store/slice/orders';

import { Loader } from 'src/components/Loader';
import Aside from './components/Aside';
import Table from './components/Table';

import { ROUTE_OPEN_ORDERS, ROUTE_ORDER_HISTORY, ROUTE_TRADE_HISTORY } from 'src/routes';
import {
  OPEN_ORDERS_BTNS,
  OPEN_ORDERS_HEADERS,
  ORDER_HISTORY_BTNS,
  TRADE_HISTORY_BTNS,
  getOrdersType,
} from 'src/constants';

import { StyledOrdersWrap } from './styled';

interface IOrder {
  direction: string;
  executed_price: string;
  pair: string;
  owner_type: string;
  quantity: string;
  status: string;
}

const Orders = () => {
  const [keyword, setKeyword] = useState('');
  const [hasInitialFetch, setHasInitialFetch] = useState({
    OPEN_ORDER: false,
    ORDER_HISTORY: false,
    TRADE_HISTORY: false,
  });

  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const ORDERS_TYPE = getOrdersType(pathname);

  const { orders, loading } = useSelector(({ orders }) => orders);
  const [openOrderCurrentPage, setOpenOrderCurrentPage] = useState(1);
  const [orderHistoryCurrentPage, setOrderHistoryCurrentPage] = useState(1);
  const [tradeHistoryCurrentPage, setTradeHistoryCurrentPage] = useState(1);

  const CURRENT_PAGE = {
    OPEN_ORDER: openOrderCurrentPage,
    ORDER_HISTORY: orderHistoryCurrentPage,
    TRADE_HISTORY: tradeHistoryCurrentPage,
  };

  const handleApplyFilters = (type: string, pair: string) => {
    const filterType = type && type !== 'Type' ? `&type=${type}` : '';
    const filterPair = pair && pair !== 'Pair' ? `&pair=${pair}` : '';

    setHasInitialFetch((prevState) => ({ ...prevState, [ORDERS_TYPE]: false }));
    dispatch(fetchOrders({ type: ORDERS_TYPE, page: 1, filterType, filterPair }));
  };

  useEffect(() => {
    if (hasInitialFetch[ORDERS_TYPE]) {
      dispatch(
        fetchOrders({
          type: ORDERS_TYPE,
          page: CURRENT_PAGE[ORDERS_TYPE],
          filterType:
            orders[ORDERS_TYPE].filterType && orders[ORDERS_TYPE].filterType !== 'Type'
              ? `&type=${orders[ORDERS_TYPE].filterType}`
              : '',
          filterPair:
            orders[ORDERS_TYPE].filterPair && orders[ORDERS_TYPE].filterPair !== 'Pair'
              ? `&pair=${orders[ORDERS_TYPE].filterPair}`
              : '',
        }),
      );
    }

    if (!orders[ORDERS_TYPE].data) {
      dispatch(
        fetchOrders({
          type: ORDERS_TYPE,
          page: CURRENT_PAGE[ORDERS_TYPE],
          filterType:
            orders[ORDERS_TYPE].filterType && orders[ORDERS_TYPE].filterType !== 'Type'
              ? `&type=${orders[ORDERS_TYPE].filterType}`
              : '',
          filterPair:
            orders[ORDERS_TYPE].filterPair && orders[ORDERS_TYPE].filterPair !== 'Pair'
              ? `&pair=${orders[ORDERS_TYPE].filterPair}`
              : '',
        }),
      );
    }

    setHasInitialFetch(() => ({
      OPEN_ORDER: false,
      ORDER_HISTORY: false,
      TRADE_HISTORY: false,
      [ORDERS_TYPE]: true,
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openOrderCurrentPage, orderHistoryCurrentPage, tradeHistoryCurrentPage, pathname]);

  useEffect(() => {
    if (keyword.length) {
      const filteredArray = orders[ORDERS_TYPE].dataInitial.filter(
        ({ direction, executed_price, pair, owner_type, quantity, status }: IOrder) => {
          const directionMatch = direction.toLowerCase().includes(keyword.toLowerCase());
          const executedPriceMatch = executed_price?.toString()?.includes(keyword);
          const pairMatch = pair.toLowerCase().includes(keyword.toLowerCase());
          const ownerTypeMatch = owner_type.toLowerCase().includes(keyword.toLowerCase());
          const quantityMatch = quantity.toString().includes(keyword);
          const statusMatch = status.toLowerCase().includes(keyword.toLowerCase());

          return (
            directionMatch ||
            executedPriceMatch ||
            pairMatch ||
            ownerTypeMatch ||
            quantityMatch ||
            statusMatch
          );
        },
      );
      dispatch(filterOrdersBySearch({ orderType: ORDERS_TYPE, orders: filteredArray }));
    } else {
      dispatch(
        filterOrdersBySearch({ orderType: ORDERS_TYPE, orders: orders[ORDERS_TYPE].dataInitial }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  useEffect(() => {
    setOpenOrderCurrentPage(orders.OPEN_ORDER.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.OPEN_ORDER.data]);

  useEffect(() => {
    setOrderHistoryCurrentPage(orders.ORDER_HISTORY.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.ORDER_HISTORY.data]);

  useEffect(() => {
    setTradeHistoryCurrentPage(orders.TRADE_HISTORY.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.TRADE_HISTORY.data]);

  useEffect(() => {
    dispatch(fetchNotificationsCount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <>
      <StyledOrdersWrap>
        <Aside />
        <Routes>
          <Route
            path={ROUTE_OPEN_ORDERS}
            element={
              <Table
                title="Open Orders"
                buttons={OPEN_ORDERS_BTNS}
                tableHeaders={OPEN_ORDERS_HEADERS}
                columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                data={orders[ORDERS_TYPE].data}
                totalPages={orders[ORDERS_TYPE].totalPages}
                currentPage={openOrderCurrentPage}
                setCurrentPage={setOpenOrderCurrentPage}
                handleApplyFilters={handleApplyFilters}
                hasAsideBtns
                keyword={keyword}
                setKeyword={setKeyword}
              />
            }
          />
          <Route
            path={ROUTE_ORDER_HISTORY}
            element={
              <Table
                title="Order History"
                buttons={ORDER_HISTORY_BTNS}
                tableHeaders={OPEN_ORDERS_HEADERS}
                columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                hasDateBtn
                hasAsideBtns
                data={orders[ORDERS_TYPE].data}
                totalPages={orders[ORDERS_TYPE].totalPages}
                currentPage={orderHistoryCurrentPage}
                setCurrentPage={setOrderHistoryCurrentPage}
                handleApplyFilters={handleApplyFilters}
                keyword={keyword}
                setKeyword={setKeyword}
              />
            }
          />
          <Route
            path={ROUTE_TRADE_HISTORY}
            element={
              <Table
                title="Trade History"
                buttons={TRADE_HISTORY_BTNS}
                tableHeaders={OPEN_ORDERS_HEADERS}
                columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                hasAsideBtns
                data={orders[ORDERS_TYPE].data}
                totalPages={orders[ORDERS_TYPE].totalPages}
                currentPage={tradeHistoryCurrentPage}
                setCurrentPage={setTradeHistoryCurrentPage}
                handleApplyFilters={handleApplyFilters}
                keyword={keyword}
                setKeyword={setKeyword}
              />
            }
          />
        </Routes>
      </StyledOrdersWrap>
    </>
  );
};

export default Orders;
