import React, { FC } from 'react';

import { Button } from 'src/components/Button';

import { StyledPaginationButtonsWrap } from '../Loader/styled';

interface IPagination {
  currentPage: number;
  nPages: number;
  // eslint-disable-next-line no-unused-vars
  setCurrentPage: any;
}

const Pagination: FC<IPagination> = ({ currentPage, nPages, setCurrentPage }) => {
  const maxPageButtonsToShow = 5;

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < nPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPageButtons = () => {
    const pageButtons: (string | number)[] = [];
    if (nPages <= maxPageButtonsToShow) {
      for (let i = 1; i <= nPages; i++) {
        pageButtons.push(i);
      }
    } else {
      const halfMaxButtons = Math.floor(maxPageButtonsToShow / 2);
      const startPage = Math.max(1, currentPage - halfMaxButtons);
      const endPage = Math.min(nPages, currentPage + halfMaxButtons);

      if (startPage > 1) {
        pageButtons.push(1);
        if (startPage > 2) {
          pageButtons.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(i);
      }

      if (endPage < nPages) {
        if (endPage < nPages - 1) {
          pageButtons.push('...');
        }
        pageButtons.push(nPages);
      }
    }

    return pageButtons.map((page, index) => (
      <Button
        key={index}
        type={currentPage === page ? 'default' : 'text'}
        text={page as string}
        onClick={() => handlePageClick(page as string)}
      />
    ));
  };

  const handlePageClick = (page: string) => {
    if (page !== '...') {
      setCurrentPage(page);
    }
  };

  return (
    <StyledPaginationButtonsWrap>
      {currentPage !== 1 && <Button text="<" type="text" onClick={handlePrevClick} />}
      {renderPageButtons()}
      {currentPage !== nPages && <Button text=">" type="text" onClick={handleNextClick} />}
    </StyledPaginationButtonsWrap>
  );
};

export default Pagination;
