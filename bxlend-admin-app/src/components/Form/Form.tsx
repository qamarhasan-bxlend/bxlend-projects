import React, { FC, useState } from 'react';

import { Container } from 'src/components/Container';
import { Select } from 'src/components/Select';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/Input';

import { StyledForm, StyledWrap } from './styled';

type FormType = 'manual' | 'deposit';

const Form: FC<{ type: FormType }> = ({ type }) => {
  const [userCurrency, setUserCurrency] = useState('USD');
  const [notes, setNotes] = useState('');
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('USD');
  const [currency, setCurrency] = useState('USD');
  const isDeposit = type === 'deposit';

  return (
    <StyledForm>
      <Container paddingBottom="1rem">
        {isDeposit ? 'Manual Deposit' : 'Enter details and submit form for withdrawing'}
      </Container>
      <br />
      <Input
        label={isDeposit ? 'Deposit to' : 'Withdraw from'}
        type="number"
        placeholder="Enter user ID"
        value={userId}
        onChange={(e) => setUserId(e.currentTarget.value)}
      />
      <br />
      <Input
        label={`Amount to be ${isDeposit ? 'deposited' : 'withdrawn'}`}
        type="number"
        placeholder="Enter..."
        value={amount}
        onChange={(e) => setAmount(e.currentTarget.value)}
      />
      <br />
      <StyledWrap>
        <div>
          <Select
            label="User currency"
            options={[
              {
                value: 'USD',
                label: 'USD',
              },
              {
                value: 'EURO',
                label: 'EURO',
              },
              {
                value: 'RUB',
                label: 'RUB',
              },
            ]}
            value={userCurrency}
            onChange={(e) => setUserCurrency(e.currentTarget.value)}
          />
        </div>
        <div>
          <Select
            label={`${isDeposit ? 'Deposit' : 'Withdraw in'} currency`}
            options={[
              {
                value: 'USD',
                label: 'USD',
              },
              {
                value: 'EURO',
                label: 'EURO',
              },
              {
                value: 'RUB',
                label: 'RUB',
              },
            ]}
            value={currency}
            onChange={(e) => setCurrency(e.currentTarget.value)}
          />
        </div>
      </StyledWrap>
      <Container>
        <Input type="textarea" label="Notes" value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
        <Container textAlign="right">
          <Button text="Submit" />
        </Container>
      </Container>
    </StyledForm>
  );
};

export default Form;
