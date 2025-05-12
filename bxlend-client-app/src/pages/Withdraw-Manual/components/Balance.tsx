import React, { FC } from 'react';

const Balance: FC<{ balance: string }> = ({ balance }) => {
  return (
    <div className="d-flex flex-column">
      <div className="withdraw-balance-title mb-2">BTC Balance</div>
      <div className="withdraw-balance-content">{`${balance} BTC`}</div>
    </div>
  );
};

export default Balance;
