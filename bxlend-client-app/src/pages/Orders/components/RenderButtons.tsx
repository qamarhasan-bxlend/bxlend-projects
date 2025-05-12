import React from 'react';
import { useLocation } from 'react-router-dom';

import { useDispatch } from 'src/store/useDispatch';
import { updateFilterPair, updateFilterType } from 'src/store/slice/orders';

import { Select } from 'src/components/Select';
import Button from './Button';

import { getOrdersType } from 'src/constants';

const RenderButtons = ({ buttons, pair, type, pairData }) => {
  const sortedPairs = [...pairData].sort((a, b) => a.symbol.localeCompare(b.symbol));

  const { pathname } = useLocation();

  const ORDERS_TYPE = getOrdersType(pathname);

  const dispatch = useDispatch();

  return buttons.map(({ text, hasDropDown, gap }) => {
    if (text === 'Type') {
      return (
        <Select
          key="1"
          placeholder="Type"
          value={type}
          options={[
            { value: 'BUY', label: 'BUY' },
            { value: 'SELL', label: 'SELL' },
          ]}
          onChange={(e) => {
            const value = e.currentTarget.value;
            dispatch(
              updateFilterType({
                orderType: ORDERS_TYPE,
                filterType: value,
              }),
            );
          }}
        />
      );
    } else if (text === '') {
      return (
        <Select
          key="2"
          placeholder="Pair"
          value={pair}
          options={sortedPairs.map((p) => ({
            value: p.symbol,
            label: p.symbol,
          }))}
          onChange={(e) => {
            const value = e.currentTarget.value;
            dispatch(
              updateFilterPair({
                orderType: ORDERS_TYPE,
                filterPair: value === '' ? '' : value,
              }),
            );
          }}
        />
      );
    } else {
      return <Button key={text} text={text} hasDropDown={hasDropDown} gap={gap} />;
    }
  });
};

export default RenderButtons;
