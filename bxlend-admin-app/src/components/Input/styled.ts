import styled from 'styled-components';

import { InputProps } from './Input';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const StyledInput = styled.input<InputProps>`
  width: calc(100% - 3rem);
  height: 2.81rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  padding: 0 1.5rem;
  outline: none;
  color: #111;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: ${({ disabled }) => (disabled ? '#f5f5f5' : '#fff')} !important;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};

  &:focus {
    border-color: #007bff !important;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.1) !important;
  }

  &:disabled {
    border-color: #ddd;
    color: #999;
  }
`;
