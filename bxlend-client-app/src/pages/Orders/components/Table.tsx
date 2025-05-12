import React, { FC } from 'react';

import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';
import { Table as OrdersTable } from 'src/components/Table';
import ButtonsRow from './ButtonsRow';
import NoResult from 'src/components/NoResult/NoResult';

interface IDataRow {
  created_at: string;
  direction: string;
  fee: { percentage: number; amount: string };
  id: string;
  owner: string;
  owner_type: string;
  pair: string;
  quantity: string;
  status: string;
  updated_at: string;
  wallets: string[];
}

interface ITable {
  title: string;
  buttons: any;
  tableHeaders: string[];
  columns: string;
  hasDateBtn?: boolean;
  hasAsideBtns?: boolean;
  data?: IDataRow[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: any;
  // eslint-disable-next-line no-unused-vars
  handleApplyFilters?: (type: string, pair: string) => void;
  keyword: string;
  setKeyword: any;
}

const Table: FC<ITable> = ({
  title,
  buttons,
  currentPage,
  setCurrentPage,
  hasAsideBtns,
  totalPages,
  data = [],
  keyword,
  setKeyword,
  handleApplyFilters,
}) => {
  return (
    <Glass>
      <Container fontSize="1.25rem">Spot</Container>
      <Container fontSize="1.75rem" paddingBottom="1.5rem">
        {title}
      </Container>
      <ButtonsRow
        hasAsideBtns={hasAsideBtns}
        buttons={buttons}
        handleApplyFilters={handleApplyFilters}
        keyword={keyword}
        setKeyword={setKeyword}
      />
      <Glass>
        {data?.length ? (
          <OrdersTable
            headers={['Date', 'Pair', 'Type', 'Owner Type', 'Amount', 'Status']}
            items={data ?? []}
            columns="1fr 1fr 1fr 1fr 1fr 1fr"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            detailsModalTitle="Order"
            fieldsToShow={['created_at', 'pair', 'direction', 'owner_type', 'quantity', 'status']}
          />
        ) : (
          <NoResult />
        )}
      </Glass>
    </Glass>
  );
};

export default Table;
