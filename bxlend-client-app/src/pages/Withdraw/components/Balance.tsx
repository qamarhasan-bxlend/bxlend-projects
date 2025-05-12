import React, { FC } from 'react';

import { Container } from 'src/components/Container';

interface IBalanceProps {
  name: string;
  balance: string;
  subname?: string;
}

const Balance: FC<IBalanceProps> = ({ name, balance, subname }) => {
  return (
    <div className="d-flex flex-column">
      <div className="withdraw-balance-content" style={{ display: 'flex', gap: '0.5rem' }}>
        <Container color="grey">{name}:</Container>
        <span>{balance}</span>
        <Container color="grey">{subname}</Container>
      </div>
    </div>
  );
};

export default Balance;
