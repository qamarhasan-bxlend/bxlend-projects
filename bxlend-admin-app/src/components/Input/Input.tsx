import React from 'react';
import { Label, StyledInput, Wrapper } from './styled';

export interface InputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  value?: any;
  onKeyPress?: any;
  onFocus?: any;
  accept?: string;
  styles?: any;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: any) => void;
  disabled?: boolean;
  readonly?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  disabled = false,
  readonly = false,
  label,
  placeholder,
  value,
  styles,
  onKeyPress,
  onFocus,
  onChange,
}) => {
  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <StyledInput
        readOnly={readonly}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={onFocus}
        style={styles}
        disabled={disabled}
      />
    </Wrapper>
  );
};
