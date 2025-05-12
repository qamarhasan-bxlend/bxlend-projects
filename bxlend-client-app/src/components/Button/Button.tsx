/* eslint-disable indent */
import React from 'react';
import { useSelector } from 'react-redux';
import styled, { css, keyframes } from 'styled-components';

import { Loader } from 'src/components/Loader';

interface ButtonProps {
  text: any;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  $fullWidth?: boolean;
  $isDark?: boolean;
  type?: 'outlined' | 'text' | 'default';
  styles?: any;
  $isPulsing?: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick?: (e: any) => void;
}

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 254, 185, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 15px 10px rgba(0, 254, 185, 0.4);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 254, 185, 0.6);
    transform: scale(1);
  }
`;

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

  background-color: ${({ theme, disabled, type }) =>
    disabled && type !== 'text'
      ? theme.palette.grey[0]
      : type === 'outlined' || type === 'text'
      ? 'transparent'
      : theme.palette.teal}; // Light theme background

  color: ${({ theme, type }) =>
    type === 'default' ? `${theme.palette.primary} !important` : theme.palette.primary};

  border: ${({ type, theme }) =>
    type === 'outlined' ? `2px solid ${theme.palette.teal}` : 'none'};

  &:hover {
    background: ${({ theme, disabled, type }) =>
      disabled
        ? theme.palette.grey[0]
        : type === 'outlined' || type === 'text'
        ? 'transparent'
        : theme.palette.gradients.blueGradient}; // Light theme hover

    color: ${({ theme, type, $isDark }) =>
      type === 'outlined' || type === 'text'
        ? $isDark
          ? theme.palette.white
          : theme.palette.primary
        : `${theme.palette.white} !important`};

    border-color: ${({ theme, type, $isDark }) =>
      type === 'outlined'
        ? $isDark
          ? theme.palette.white
          : theme.palette.primary
        : 'transparent'};
  }

  &:active {
    transform: scale(0.95);
  }

  ${({ disabled }) => disabled && 'pointer-events: none;'}

  ${({ $isPulsing }) =>
    $isPulsing &&
    css`
      animation: ${pulse} 2s infinite;
    `}
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
  $isPulsing = false,
  onClick,
  ...rest
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
      $isPulsing={$isPulsing}
      {...rest}
    >
      {isLoading ? <Loader size={24} /> : text}
    </StyledButton>
  );
};
