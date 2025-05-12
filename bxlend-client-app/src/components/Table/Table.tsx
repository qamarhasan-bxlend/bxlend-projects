import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Container } from '../Container';
import ItemDetailsModal from './components/ItemDetailsModal';
import ListItemRenderer from './components/ListItemRenderer';
import Pagination from 'src/components/Pagination';
import TrxTimeline from 'src/pages/Transactions/components/TrxTimeline';
import OrderDetails from 'src/pages/PresaleTransactions/OrderDetails';

import { StyledTable } from './styled';

interface ITable {
  headers: string[];
  items: { [key: string]: any }[];
  fieldsToShow: string[];
  columns: string;
  currentPage: number;
  totalPages: number;
  currencies?: any;
  detailsModalTitle?: string;
  isTransaction?: boolean;
  isPresaleOrder?: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  // eslint-disable-next-line no-unused-vars
  actions?: (item: { [key: string]: any }) => React.ReactNode;
}

export const Table: React.FC<ITable> = ({
  headers,
  items,
  fieldsToShow,
  columns,
  currentPage,
  totalPages,
  currencies,
  detailsModalTitle,
  isTransaction,
  isPresaleOrder,
  setCurrentPage,
  actions,
}) => {
  const [activeItem, setActiveItem] = useState<{ [key: string]: any } | null>(null);

  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <>
      <StyledTable $columns={actions ? `${columns} 1fr` : columns} $isDark={isDark}>
        <div className="header">
          {headers.map((header, index) => (
            <Container key={index} color="#333 !important">
              {header}
            </Container>
          ))}
          {actions && <Container color="#333 !important">Actions</Container>}
        </div>
        {items.map((item, rowIndex) => (
          <div className="table-row" key={rowIndex} onClick={() => setActiveItem(item)}>
            {fieldsToShow.map((field, colIndex) => (
              <div className="cell" key={colIndex} data-label={headers[colIndex]}>
                <ListItemRenderer item={item} field={field} currencies={currencies} />
              </div>
            ))}
            {actions && (
              <div className="cell" data-label="Actions">
                {actions(item)}
              </div>
            )}
          </div>
        ))}
      </StyledTable>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} nPages={totalPages} />
      )}
      {activeItem && (
        <ItemDetailsModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
          currencies={currencies}
          title={detailsModalTitle}
        >
          {isTransaction && activeItem.kind === 'WITHDRAW' && (
            <TrxTimeline transaction={activeItem} />
          )}
          {isPresaleOrder && activeItem.status === 'pending' && <OrderDetails order={activeItem} />}
        </ItemDetailsModal>
      )}
    </>
  );
};
