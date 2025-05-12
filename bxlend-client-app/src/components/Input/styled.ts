/* eslint-disable indent */
import styled from 'styled-components';

import { InputProps } from './Input';

export const Wrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const StyledInput = styled.input<InputProps>`
  width: 100%;
  height: 2.81rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  padding: 0 1.5rem;
  outline: none;
  color: ${({ theme }) => theme.palette.black} !important;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: ${({ disabled }) => (disabled ? '#f5f5f5' : '#fff')} !important;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};

  &:focus {
    ${({ type }) =>
      type !== 'search'
        ? `
      border-color: #007bff !important;
      box-shadow: 0 0 8px rgba(0, 123, 255, 0.1) !important;
    `
        : `
      border-color: transparent;
      box-shadow: none;
    `}
  }

  &:disabled {
    border-color: #ddd;
    color: #999;
  }
`;

export const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  z-index: 1;
`;
