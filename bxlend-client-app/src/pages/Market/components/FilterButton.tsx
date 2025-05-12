import React from 'react';

const MarketFilterButton = ({ filterButton, filter, setFilter }) => (
  <button
    type="button"
    className={`market-filter-btn btn px-4 me-4 ${filter === filterButton ? 'active' : ''}`}
    onClick={() => setFilter(filterButton)}
  >
    {filterButton}
  </button>
);

export default MarketFilterButton;
