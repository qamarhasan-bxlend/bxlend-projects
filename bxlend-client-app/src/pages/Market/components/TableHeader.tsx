import React from 'react';

import { useSelector } from 'react-redux';

const TableHeader = () => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <div>
      <div className={`table-title row ${isDark ? 'isDark' : ''}`}>
        <div className="col-sm-3 col-md-3 col-3 col-lg-3 justify-content-start align-items-center d-flex ps-5">
          Name
        </div>
        <div className="col-sm-6 col-md-3 col-6 col-lg-1 justify-content-center align-items-center d-flex">
          Price
        </div>
        <div className="col-sm-4 col-4 col-md-4 col-1 col-lg-2 justify-content-center align-items-center d-none d-md-flex">
          24h Change
        </div>
        <div className="col-sm-0 col-lg-2 justify-content-center align-items-center d-none d-lg-flex">
          24h Volume
        </div>
        <div className="col-sm-0 col-lg-2 justify-content-center align-items-center d-none d-lg-flex">
          Market Cap
        </div>
        <div className="col-2 col-sm-3 col-md-2 col-lg-2 justify-content-center align-items-center d-lg-flex">
          Action
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
