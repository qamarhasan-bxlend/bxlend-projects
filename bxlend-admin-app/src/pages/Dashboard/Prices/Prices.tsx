import React from 'react';

import TableRow from './TableRow';
import Text from 'src/components/Text';

import { PRICES } from 'src/utils/constants';

import { StyledWidgetDropdown } from '../Widget/styled';
import { StyledWrap } from '../styled';
import { StyledHeader, StyledTableWrap } from './styled';

const Prices = () => {
  return (
    <StyledWrap>
      <StyledHeader>
        <Text size={26} color="#172A4F" family="Inter-Medium" padding="2vh 0">
          Prices
        </Text>
        <StyledWidgetDropdown>View All</StyledWidgetDropdown>
      </StyledHeader>
      <StyledTableWrap>
        <TableRow name="Coin" price="Price" isHeader />
        <ul>
          {PRICES.map(({ id, name, subname, price }) => (
            <TableRow key={id} name={name} subname={subname} price={price} />
          ))}
        </ul>
      </StyledTableWrap>
    </StyledWrap>
  );
};

export default Prices;
