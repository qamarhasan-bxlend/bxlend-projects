import React from 'react';

import { useSelector } from 'react-redux';

const TableHead = () => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <thead>
      <tr
        className={`table-title row mb-4 ${isDark ? 'isDark' : ''}`}
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <th className="col-sm-4 col-4 col-lg-2 justify-content-start align-items-center d-flex ps-5">
          Coin
        </th>
        <th className="col-sm-4 col-4 col-lg-2 justify-content-center align-items-center d-flex">
          Total
        </th>
        <th className="col-sm-4 col-4 col-lg-2 justify-content-center align-items-center d-flex">
          Available
        </th>
        <th className="col-sm-0 col-lg-2 justify-content-center align-items-center d-none d-lg-flex">
          USD value
        </th>
        <th className="col-sm-0 col-lg-2 justify-content-start align-items-center d-none d-lg-flex ps-5 ps-xl-4 pe-5">
          Action
        </th>
      </tr>
    </thead>
  );
};

export default TableHead;
