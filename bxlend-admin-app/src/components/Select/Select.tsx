import React from 'react';

import { Label, StyledSelect, Wrapper } from './styled';

export interface ISelect {
  label?: string;
  value: string;
  options: { value: string; label: string }[];
  // eslint-disable-next-line no-unused-vars
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const Select: React.FC<ISelect> = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = 'Select an option...',
}) => {
  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <StyledSelect value={value} onChange={onChange} disabled={disabled}>
        <option value="" disabled hidden={!value} id="option-tag">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} id="option-tag">
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </Wrapper>
  );
};
