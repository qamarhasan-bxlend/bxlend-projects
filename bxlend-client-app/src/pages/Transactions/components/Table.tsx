import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowDown } from 'src/assets/ArrowDown.svg';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Glass } from 'src/components/Glass';
import { Table as TrxTable } from 'src/components/Table';
import ButtonsRow from './ButtonsRow';
import NoResult from 'src/components/NoResult/NoResult';

import { ROUTE_TRANSACTIONS, ROUTE_TRANSACTIONS_FIAT } from 'src/routes';

import { StyledTable } from '../styled';

interface ITable {
  title: string;
  buttons: { id: number; text: string; hasDropDown: boolean; caption?: string }[];
  tableHeaders: string[];
  columns: string;
  hasDateBtn?: boolean;
  hasSearch?: boolean;
  hasAsideBtns?: boolean;
  isTransaction?: boolean;
  transactions?: any;
  selectedType?: string;
  setSelectedType?: any;
  currentPage?: number;
  setCurrentPage?: any;
  totalPages?: number;
  currencies?: any;
}

const Table: FC<ITable> = ({
  title,
  buttons,
  hasDateBtn,
  hasAsideBtns,
  isTransaction,
  transactions,
  selectedType,
  setSelectedType,
  currentPage,
  setCurrentPage,
  totalPages,
  currencies,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Glass>
      <Container>
        <StyledTable>
          <Container
            display="flex"
            alignItems="center"
            cursor="pointer"
            marginBottom="1.25rem"
            onClick={() => navigate(-1)}
          >
            <span>
              <ArrowDown height={8} style={{ transform: 'rotate(90deg)' }} />
            </span>
            <Container paddingTop="0.2rem">
              <Button text="Back" type="text" />
            </Container>
          </Container>
          {isTransaction && (
            <Container fontSize="1.5rem" paddingBottom="1.rem">
              Spot
            </Container>
          )}
          <br />
          <Container fontSize="1.25rem" fontWeight={600} paddingBottom="1rem">
            {title}
          </Container>
          {isTransaction && (
            <Container display="flex" alignItems="center" gap="0.5rem" paddingBottom="1.5rem">
              <Button
                text="Crypto"
                type={pathname === ROUTE_TRANSACTIONS ? 'default' : 'outlined'}
                onClick={() => navigate(ROUTE_TRANSACTIONS)}
              />
              <Button
                text="Fiat"
                type={
                  pathname === `${ROUTE_TRANSACTIONS}${ROUTE_TRANSACTIONS_FIAT}`
                    ? 'default'
                    : 'outlined'
                }
                onClick={() => navigate(`${ROUTE_TRANSACTIONS}${ROUTE_TRANSACTIONS_FIAT}`)}
              />
            </Container>
          )}
          <ButtonsRow
            hasAsideBtns={!!hasAsideBtns}
            hasDateBtn={hasDateBtn}
            hasSearch={pathname === ROUTE_TRANSACTIONS}
            buttons={buttons}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
          <Container>
            <Glass>
              {transactions?.length ? (
                <TrxTable
                  headers={['Date', 'Currency', 'Type', 'Wallet ID', 'Amount', 'Status']}
                  items={transactions}
                  columns="1fr 1fr 1fr 1fr 1fr 1fr"
                  currentPage={currentPage as number}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages as number}
                  currencies={currencies}
                  detailsModalTitle={selectedType ? `${selectedType} Details` : 'Transaction'}
                  isTransaction
                  fieldsToShow={[
                    'created_at',
                    'currency',
                    'kind',
                    'recipient_address',
                    'quantity',
                    'status',
                  ]}
                />
              ) : (
                <NoResult />
              )}
            </Glass>
          </Container>
        </StyledTable>
      </Container>
    </Glass>
  );
};

export default Table;
