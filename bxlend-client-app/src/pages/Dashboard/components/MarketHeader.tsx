import React from 'react';

import { useSelector } from 'react-redux';

const MarketHeader = () => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <thead>
      <tr
        className={`d-flex justify-content-center dashboard-market-table-head row mb-2 ${
          isDark ? 'isDark' : ''
        }`}
      >
        <th className="col-sm-3 col-4 justify-content-start align-items-center d-flex ps-sm-4 ps-2">
          Name
        </th>
        <th className="col-sm-3 col-2 justify-content-center align-items-center d-flex ps-0">
          Price
        </th>
        <th className="col-sm-4 col-3 justify-content-center align-items-center d-flex ps-0">
          24h Change
        </th>
        <th className="col-sm-2 col-3 justify-content-end align-items-center d-flex pe-sm-5 pe-2">
          Action
        </th>
      </tr>
    </thead>
  );
};

export default MarketHeader;
