import React from 'react';
import { Link } from 'react-router-dom';

import Dropdown from 'src/components/Dropdown';

import './index.css';

const DropdownList = ({ currencies }) => {
  return (
    <Dropdown classNames="w-100 drop-down">
      {currencies.map((coin, index) => (
        <Link
          style={{ color: '#172A4F' }}
          key={index}
          to={`/deposit/${coin.code}`}
          state={{ code: coin.code }}
        >
          <li>
            <button className="dropdown-item py-2">
              <div className="d-flex">
                <div className="ms-2 d-flex">
                  <div className="fw-bold" style={{ color: '#172A4F' }}>
                    {coin.code}
                  </div>
                  <div className="ms-2" style={{ color: '#172A4F' }}>
                    {coin.name}
                  </div>
                </div>
              </div>
            </button>
          </li>
        </Link>
      ))}
    </Dropdown>
  );
};

export default DropdownList;
