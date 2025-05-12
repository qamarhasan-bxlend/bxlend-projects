import React, { FC } from 'react';

import { StyledTableRow } from '../styled';

const TableRow: FC<{ name: string; subname?: string; price: string; isHeader?: boolean }> = ({ name, subname, price, isHeader }) => {
  return (
    <StyledTableRow isHeader={isHeader}>
      <span>
        {name}
        {subname && <span className="price_subname">{subname}</span>}
      </span>
      <span>{price}</span>
    </StyledTableRow>
  );
};

export default TableRow;
