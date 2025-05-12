/* eslint-disable indent */
import React from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import { Loader } from '../Loader';

interface ButtonProps {
  text: any;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  $fullWidth?: boolean;
  $isDark?: boolean;
  type?: 'outlined' | 'text' | 'default';
  styles?: any;
  // eslint-disable-next-line no-unused-vars
  onClick?: (e: any) => void;
}

const ButtonStyles = css<Omit<ButtonProps, 'text'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ type }) => (type === 'outlined' ? '0.5rem 1.25rem' : '0.6rem 1.25rem')};
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border-radius: 0.31rem;
  align-self: baseline;

  background-color: ${({ disabled, type }) =>
    disabled && type !== 'text' ? '#ccc' : type === 'outlined' || type === 'text' ? 'transparent' : '#00feb9'};

  color: ${({ type }) => (type === 'default' ? `#172a4f !important` : '#172a4f')};

  border: ${({ type }) => (type === 'outlined' ? `2px solid #00feb9` : 'none')};

  &:hover {
    background: ${({ disabled, type }) =>
      disabled
        ? '#ccc'
        : type === 'outlined' || type === 'text'
        ? 'transparent'
        : 'linear-gradient(to bottom, #172a4f, #284a78, #3b6aa1)'};

    color: ${({ type, $isDark }) =>
      type === 'outlined' || type === 'text' ? ($isDark ? '#fff' : '#172a4f') : `#fff !important`};

    border-color: ${({ type, $isDark }) => (type === 'outlined' ? ($isDark ? '#fff' : '#172a4f') : 'transparent')};
  }

  &:active {
    transform: scale(0.95);
  }

  ${({ disabled }) => disabled && 'pointer-events: none;'}
`;

const StyledButton = styled.button<Omit<ButtonProps, 'text'>>`
  ${ButtonStyles}
`;

export const Button: React.FC<ButtonProps> = ({
  text,
  disabled,
  isLoading,
  type = 'default',
  className,
  $fullWidth,
  styles,
  onClick,
}) => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
      $fullWidth={$fullWidth}
      $isDark={isDark}
      style={styles}
    >
      {isLoading ? <Loader size={24} /> : text}
    </StyledButton>
  );
};
