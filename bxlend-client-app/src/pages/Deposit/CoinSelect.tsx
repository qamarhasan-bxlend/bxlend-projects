import React from 'react';

import { ChevronDown } from 'react-bootstrap-icons';

import DropdownList from './DropdownList';

const CoinSelect = ({ currencies, code }) => {
  return (
    <div className="mb-4">
      <div className="coin-title">Select Coin</div>
      <div className="coin-list-dropdown dropdown my-2">
        <button
          type="button"
          className="btn coin-dropdown-btn dropdown-toggle px-4"
          data-bs-toggle="dropdown"
        >
          <div className="d-flex">
            <div className="ms-2 d-flex">
              <div className="fw-bold">{code}</div>
              <div className="ms-2">{code}</div>
            </div>
          </div>
          <ChevronDown />
        </button>
        <DropdownList currencies={currencies} />
      </div>
    </div>
  );
};

export default CoinSelect;
