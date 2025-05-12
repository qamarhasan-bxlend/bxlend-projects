import React, { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/useDispatch';
import { fetchCurrencyPairs } from 'src/store/slice/currencyPairs';
import { fetchOrders, updateFilterPair, updateFilterType } from 'src/store/slice/orders';

import { Button } from 'src/components/Button';
import SearchBox from 'src/components/SearchBox';
import RenderButtons from './RenderButtons';

import { getOrdersType } from 'src/constants';

import { StyledButtonsRow, StyledWrap } from '../styled';

interface IButtonsRow {
  buttons: any;
  hasAsideBtns?: boolean;
  loading?: boolean;
  keyword: string;
  setKeyword: any;
  // eslint-disable-next-line no-unused-vars
  handleApplyFilters?: (pair: string, type: string) => void;
}

const ButtonsRow: FC<IButtonsRow> = ({
  buttons,
  hasAsideBtns,
  keyword,
  setKeyword,
  handleApplyFilters,
}) => {
  const { pathname } = useLocation();

  const ORDERS_TYPE = getOrdersType(pathname);

  const dispatch = useDispatch();

  const { pairs } = useSelector(({ pairs }) => pairs);
  const { orders } = useSelector(({ orders }) => orders);

  const isDisabled =
    ((!orders[ORDERS_TYPE].filterType || orders[ORDERS_TYPE].filterType === 'Type') &&
      !orders[ORDERS_TYPE].filterPair) ||
    orders[ORDERS_TYPE].filterPair === 'Pair';

  const handleReset = () => {
    dispatch(
      fetchOrders({
        type: ORDERS_TYPE,
        page: 1,
      }),
    );
    dispatch(
      updateFilterType({
        orderType: ORDERS_TYPE,
        filterType: 'Type',
      }),
    );
    dispatch(
      updateFilterPair({
        orderType: ORDERS_TYPE,
        filterType: '',
      }),
    );
  };

  useEffect(() => {
    if (!pairs.length) {
      dispatch(fetchCurrencyPairs());
    }
  }, [dispatch, pairs.length]);

  return (
    <StyledButtonsRow>
      <StyledWrap>
        <RenderButtons
          buttons={buttons}
          pair={orders[ORDERS_TYPE].filterPair || ''}
          type={orders[ORDERS_TYPE].filterType || ''}
          pairData={pairs}
        />
      </StyledWrap>
      {hasAsideBtns && (
        <StyledWrap $margin="0 0 0 auto">
          <SearchBox placeHolder="Search..." keyword={keyword} setKeyword={setKeyword} />
          <Button text="Reset" onClick={handleReset} disabled={isDisabled} />
        </StyledWrap>
      )}
      <Button
        text="Apply"
        onClick={() =>
          handleApplyFilters &&
          handleApplyFilters(orders[ORDERS_TYPE].filterType, orders[ORDERS_TYPE].filterPair)
        }
        disabled={isDisabled}
      />
    </StyledButtonsRow>
  );
};

export default ButtonsRow;
