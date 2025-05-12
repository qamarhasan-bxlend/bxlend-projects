import React from 'react';

const TableHead = () => {
  return (
    <thead>
      <tr className="row mb-2">
        <th className="col-xl-5 col-6 justify-content-start align-items-center d-flex">
          Wallet ID
        </th>
        <th className="col-xl-3 col-0 justify-content-start align-items-center d-xl-flex d-none">
          Date
        </th>
        <th className="col-xl-2 col-3 justify-content-start align-items-center d-flex">Amount</th>
        <th className="col-xl-2 col-3 justify-content-start align-items-center d-flex">Status</th>
      </tr>
    </thead>
  );
};

export default TableHead;
