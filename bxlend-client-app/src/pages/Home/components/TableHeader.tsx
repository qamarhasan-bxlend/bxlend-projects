import React from 'react';

import { useSelector } from 'react-redux';

const TableHeader = () => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <thead>
      <tr className={`table-title row mb-3 ${isDark ? 'isDark' : ''}`}>
        <th className="col-sm-3 col-4 justify-content-start align-items-center d-flex ps-5">
          Name
        </th>
        <th className="col-sm-3 col-2 justify-content-center align-items-center d-flex">Price</th>
        <th className="col-sm-4 col-3 justify-content-center align-items-center d-flex">
          24h Change
        </th>
        <th className="col-sm-2 col-3 justify-content-end align-items-center d-flex pe-5">
          Volume
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
