import React, { FC, useState } from 'react';

import { Input } from 'src/components/Input';
import { Select } from 'src/components/Select';
import Button from './Button';

import { StyledButtonsRow, StyledWrap } from '../styled';

interface IButtonsRow {
  buttons: { id: number; text: string; hasDropDown: boolean; gap?: number; caption?: string }[];
  hasDateBtn?: boolean;
  hasAsideBtns?: boolean;
  hasSearch: boolean;
  selectedType?: string;
  setSelectedType?: any;
}

const ButtonsRow: FC<IButtonsRow> = ({
  buttons,
  selectedType = 'Type',
  setSelectedType,
  hasSearch,
}) => {
  const [walletId, setWalletId] = useState('');

  return (
    <StyledButtonsRow>
      <StyledWrap>
        {buttons.map(({ text, hasDropDown, gap, id, caption }) =>
          text === 'Deposit' ? (
            <Select
              key={id}
              label="Type"
              options={[
                {
                  label: 'Deposit',
                  value: 'Deposit',
                },
                {
                  label: 'Withdraw',
                  value: 'Withdraw',
                },
              ]}
              placeholder="Select type..."
              value={selectedType}
              onChange={(e) => setSelectedType(e.currentTarget.value)}
            />
          ) : (
            <Button key={id} text={text} hasDropDown={hasDropDown} gap={gap} caption={caption} />
          ),
        )}
        {hasSearch && (
          <Input
            label="Enter wallet ID"
            value={walletId}
            onChange={(e) => setWalletId(e.currentTarget.value)}
          />
        )}
      </StyledWrap>
    </StyledButtonsRow>
  );
};

export default ButtonsRow;
