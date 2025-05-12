import React, { FC } from 'react';

import Row from './Row';

import { StyledTable, StyledRow as StyledHeader } from './styled';

interface ITable {
  headers: string[];
  data: object[];
  columns: string;
  totalPages?: number;
  currentPage?: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange?: (page: number) => void;
  hasAction?: boolean;
  hasActions?: boolean;
  loading?: boolean;
  showForm?: () => void;
}

const Table: FC<ITable> = ({
  headers,
  data,
  hasAction,
  hasActions,
  columns,
  showForm,
}) => {
  return (
    <>
      <StyledTable>
        <StyledHeader columns={columns} isHeader>
          {headers.map((title) => (
            <span key={title}>{title}</span>
          ))}
        </StyledHeader>
        {data.length ? (
          data.map((item, i) => (
            <Row
              key={headers[i]}
              item={item}
              hasAction={hasAction}
              hasActions={hasActions}
              columns={columns}
              showForm={showForm}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem' }}>There is no result.</div>
        )}
      </StyledTable>
    </>
  );
};

export default Table;
