import React from 'react';

import { ChevronDown } from 'react-bootstrap-icons';

import Dropdown from 'src/components/Dropdown';

const NetworksSelect = ({ networks }) => {
  return (
    <div>
      <div className="coin-title">Deposit to Network</div>
      <div className="coin-list-dropdown dropdown my-2">
        <button
          type="button"
          className="btn coin-dropdown-btn dropdown-toggle px-4"
          data-bs-toggle="dropdown"
          disabled
        >
          {!!networks && !!networks.length && (
            <div className="d-flex">
              <div className="fw-bold">{networks[0]}</div>
              <div className="ms-2">{networks[0]}</div>
            </div>
          )}
          <ChevronDown />
        </button>
        {!!networks && !!networks.length && (
          <Dropdown classNames="w-100">
            {networks.map((network, index) => (
              <li key={index}>
                <button className="dropdown-item">
                  <div className="ms-2 d-flex">
                    <div className="fw-bold">{network}</div>
                    <div className="ms-2">{network}</div>
                  </div>
                </button>
              </li>
            ))}
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default NetworksSelect;
