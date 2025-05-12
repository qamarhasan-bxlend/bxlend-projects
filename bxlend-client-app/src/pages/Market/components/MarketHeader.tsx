import React from 'react';
import { useSelector } from 'react-redux';
import { Search } from 'react-bootstrap-icons';

import { Container } from 'src/components/Container';
import { MobileSearch } from 'src/components/MobileSearch';
import SearchBox from 'src/components/SearchBox';

const MarketHeader = ({ keyword, setKeyword }) => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <div className="d-flex justify-content-between align-items-center">
      <Container fontSize="1.75rem">Market</Container>
      <div className={`d-flex align-items-center market-search-box ${isDark ? 'isDark' : ''}`}>
        <SearchBox placeHolder="Search coin" keyword={keyword} setKeyword={setKeyword} />
      </div>
      <button
        id="button-addon4"
        type="button"
        className="mobile-search-icon d-none btn btn-link text-info"
        data-bs-toggle="modal"
        data-bs-target="#mobileSearchInput"
      >
        <Search />
      </button>
      <MobileSearch setKeyword={setKeyword} />
    </div>
  );
};

export default MarketHeader;
